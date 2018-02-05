import { forEach, ManifestLoader } from 'substance'

/*
  A PersistedDocumentArchive is a 3-tier stack representing a document archive
  at different application levels:

  1. Editor: an application such as Texture works on an in-memory data model,
     managed by EditorSessions. There may be multiple sessions for different parts of the
     document archive, e.g. the manuscript and an entity db.
  2. Buffer: a short-term storage for pending changes. Until the document archive
     is saved permanently, changes are recorded and can be persisted, e.g. to
     avoid loosing changes when the browser is closed inadvertently.
  3. Storage: a long-term storage where the document archive is persisted and versioned.

  PersistedDocumentArchive manages the communication between the three layers, e.g.
  when the user changes a document, it records the change and stores it into the buffer,
  and eventually saving a new version of the ardhive.
*/
export default class PersistedDocumentArchive {
  // TODO: move this into substance

  constructor(storage, buffer) {
    this.storage = storage
    this.buffer = buffer

    this._archiveId = null
    this._upstreamArchive = null
    this._sessions = null
  }

  load(archiveId) {
    const storage = this.storage
    const buffer = this.buffer

    let upstreamArchive
    return Promise.resolve()
    .then(() => {
      return storage.read(archiveId)
    })
    .then((res) => {
      upstreamArchive = res
      return buffer.load()
    })
    .then(() => {
      // Ensure that the upstream version is compatible with the buffer.
      // The buffer may contain pending changes.
      // In this case the buffer should be based on the same version
      // as the latest version in the storage.
      if (!buffer.hasPendingChanges()) {
        let localVersion = buffer.getVersion()
        let upstreamVersion = upstreamArchive.version
        if (localVersion && upstreamVersion && localVersion !== upstreamVersion) {
          // If the local version is out-of-date, it would be necessary to 'rebase' the
          // local changes.
          console.error('Upstream document has changed. Discarding local changes')
          this.buffer.reset(upstreamVersion)
        } else {
          buffer.reset(upstreamVersion)
        }
      }
    })
    .then(() => {
      // convert raw archive into sessions
      let sessions = this._load(upstreamArchive)
      // contract: there must be a manifest
      if (!sessions['manifest']) {
        throw new Error('There must be a manifest session.')
      }
      // apply pending changes
      if (!buffer.hasPendingChanges()) {
        // TODO: when we have a persisted buffer we need to apply all pending
        // changes.
        // For now, we always start with a fresh buffer
      } else {
        buffer.reset(upstreamArchive.version)
      }
      // register for any changes in each session
      this._registerForChanges(sessions)

      this._archiveId = archiveId
      this._upstreamArchive = upstreamArchive
      this._sessions = sessions

      return this
    })
  }

  save() {
    if (!this.buffer.hasPendingChanges()) {
      console.info('Save: no pending changes.')
      return Promise.resolve()
    }
    return this._save()
  }

  getEditorSession(docId) {
    return this._sessions[docId]
  }

  /*
    Creates EditorSessions from a raw archive.
    This might involve some consolidation and ingestion.
  */
  _load(rawArchive) {
    let sessions = {}
    let manifestSession = this._loadManifest(rawArchive['manifest.xml'])
    sessions['manifest'] = manifestSession
    // TODO: either we find a modular way how to call importers for single resources
    let manifest = manifestSession.getDocument()
    // TODO: ATM we have the problem, that import must be done in the correct
    // order as they are not independent from each other. We should think harder how we can make them independent
    // e.g. by introducing an explicit ingestion step.
    // Example: we are using an entity for things like authors and affiliations.
    // There we have pulled out responsibility from the JATS model, which then requires
    // a pub-meta.json. After ingestion, these two documents should be only loosely coupled,
    // and thus import should be independent. ATM, ingestion is done during the regular import
    // of the manuscript, which makes the importer dependent, which is bad.
    // An ingestion workflow needs a different architecture, because it works
    // in a more opinionated way, and results in implicit changes to the documents.
    // E.g. resources are added (such as pub-meta.json) and content is transformed.
    // After ingestion it must be possible to load resources independently.
    let documentNodes = manifest.getDocumentNodes()
    documentNodes.forEach(node => {
      let id = node.attr('id')
      let type = node.attr('type')
      let path = node.attr('path') || id
      let record = rawArchive[path]
      // HACK: passing down 'sessions' so that we can add the pub-meta session in Texture
      let session = this._loadDocument(type, record, sessions)
      sessions[id] = session
    })
    return sessions
  }

  _loadManifest(record) {
    if (!record) {
      throw new Error('manifest.xml is missing')
    }
    return ManifestLoader.load(record.data)
  }

  _registerForChanges(sessions) {
    forEach(sessions, (session, docId) => {
      session.onUpdate('document', (change) => {
        this.buffer.addChange(docId, change)
      })
    })
  }

  /*
    Create a raw archive for upload from the changed resources.
  */
  _save() {
    const archiveId = this._archiveId
    const buffer = this.buffer
    const storage = this.storage
    const sessions = this._sessions
    let data = {
      version: buffer.getVersion(),
      diff: buffer.getChanges()
    }
    // Update the manifest if changed
    let manifest = sessions.manifest.getDocument()
    if (buffer.hasResourceChanged('manifest')) {
      data['manifest.xml'] = {
        id: 'manifest',
        data: manifest.toXML(),
        encoding: 'utf8',
        updatedAt: Date.now()
      }
    }
    // Note: we are only adding resources that have changed
    // and only those which are registered in the manifest
    let documentNodes = manifest.getDocumentNodes()
    documentNodes.forEach(node => {
      let id = node.attr('id')
      if (!buffer.hasResourceChanged(id)) return
      let type = node.attr('type')
      let path = node.attr('path') || id
      let session = sessions[id]
      // TODO: how should we communicate file renamings?
      data[path] = {
        id,
        // HACK: same as when loading we pass down all sessions so that we can do some hacking there
        data: this._exportDocument(type, session, sessions),
        encoding: 'utf8',
        updatedAt: Date.now()
      }
    })
    let assetNodes = manifest.getAssetNodes()
    assetNodes.forEach(node => {
      let id = node.attr('id')
      if (!buffer.hasBlob(id)) return
      let path = node.attr('path') || id
      let blob = buffer.getBlob(id)
      data[path] = {
        id,
        data: blob,
        encoding: 'blob',
        createdAt: Date.now(),
        updatedAt: Date.now()
      }
    })
    // CHALLENGE: we either need to lock the buffer, so that
    // new changes are interfering with ongoing sync
    // or we need something pretty smart caching changes until the
    // sync has succeeded or failed, e.g. we could use a second buffer in the meantime
    // probably a fast first-level buffer (in-mem) is necessary anyways, even in conjunction with
    // a slower persisted buffer
    return storage.write(archiveId, data).then(res => {
      // TODO: if successful we should receive the new version as response
      // and then we can reset the buffer
      res = JSON.parse(res)
      console.log('Saved. New version:', res.version)
      buffer.reset(res.version)
    }).catch(err => {
      console.error('Saving failed.', err)
    })
  }
}