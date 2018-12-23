import { includes, EventEmitter } from 'substance'

export default class ManuscriptTOCProvider extends EventEmitter {
  constructor (articleSession, config) {
    super()

    this.articleSession = articleSession

    this.entries = this.computeEntries()
    if (this.entries.length > 0) {
      this.activeEntry = this.entries[0].id
    } else {
      this.activeEntry = null
    }

    this.articleSession.on('change', this._onDocumentChange, this)
  }

  dispose () {
    this.articleSession.off(this)
  }

  _onDocumentChange (change) {
    let doc = this.getDocument()
    let needsUpdate = false
    let tocTypes = this.constructor.tocTypes

    // HACK: this is not totally correct but works.
    // Actually, the TOC should be updated if tocType nodes
    // get inserted or removed from the container, plus any property changes
    // This implementation just checks for changes of the node type
    // not the container, but as we usually create and show in
    // a single transaction this works.
    for (let i = 0; i < change.ops.length; i++) {
      let op = change.ops[i]
      let nodeType
      if (op.isCreate() || op.isDelete()) {
        let nodeData = op.getValue()
        nodeType = nodeData.type
        if (includes(tocTypes, nodeType)) {
          needsUpdate = true
          break
        }
      } else if (op.path) {
        let id = op.path[0]
        let node = doc.get(id)
        if (node && includes(tocTypes, node.type)) {
          needsUpdate = true
          break
        }
      }
    }
    if (needsUpdate) {
      this.entries = this.computeEntries()
      this.emit('toc:updated')
    }
  }

  computeEntries () {
    // TODO: try to use model API here
    // NOTE: this is not general anymore for sake of simplicity
    const doc = this.getDocument()
    const article = doc.get('article')

    let entries = []

    // Title is always there
    entries.push({
      id: 'title',
      name: 'Title',
      level: 1
    })

    // Note: For abstract we need to find first text node
    // inside container to set selection there
    const abstract = doc.get('abstract')
    if (abstract.content.length > 0) {
      let first = abstract.find('p')
      if (first && first.getText()) {
        entries.push({
          id: abstract.id,
          name: 'Abstract',
          level: 1,
          node: abstract
        })
      }
    }

    let body = doc.get('body')
    const contentNodes = body.getContent()
    contentNodes.forEach(node => {
      if (node.type === 'heading') {
        entries.push({
          id: node.id,
          name: node.getText(),
          level: node.level,
          node: node
        })
      }
    })

    if (article.footnotes.length > 0) {
      entries.push({
        id: 'footnotes',
        name: 'Footnotes',
        level: 1
      })
    }

    if (article.references.length > 0) {
      entries.push({
        id: 'references',
        name: 'References',
        level: 1
      })
    }

    return entries
  }

  getEntries () {
    return this.entries
  }

  getDocument () {
    return this.articleSession.getDocument()
  }

  markActiveEntry (scrollPane) {
    let panelContent = scrollPane.getContentElement()
    let contentHeight = scrollPane.getContentHeight()
    let scrollPaneHeight = scrollPane.getHeight()
    let scrollPos = scrollPane.getScrollPosition()

    let scrollBottom = scrollPos + scrollPaneHeight
    let regularScanline = scrollPos + 10
    let smartScanline = 2 * scrollBottom - contentHeight
    let scanline = Math.max(regularScanline, smartScanline)

    let tocNodes = this.computeEntries()
    if (tocNodes.length === 0) return

    // Use first toc node as default
    let activeEntry = tocNodes[0].id
    for (let i = tocNodes.length - 1; i >= 0; i--) {
      let tocNode = tocNodes[i]
      let nodeEl = panelContent.find('[data-id="' + tocNode.id + '"]')
      if (!nodeEl) {
        console.warn('Not found in Content panel', tocNode.id)
        return
      }
      let panelOffset = scrollPane.getPanelOffsetForElement(nodeEl)
      if (scanline >= panelOffset) {
        activeEntry = tocNode.id
        break
      }
    }

    if (this.activeEntry !== activeEntry) {
      this.activeEntry = activeEntry
      this.emit('toc:updated')
    }
  }
}

// TODO: document how this works
ManuscriptTOCProvider.tocTypes = ['heading', 'reference', 'footnote', 'paragraph']
