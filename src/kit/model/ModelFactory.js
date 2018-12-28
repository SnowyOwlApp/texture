import generateModelClass from './_generatModelClass'

export default class ModelFactory {
  constructor (document, api, modelRegistry) {
    this._document = document
    this._api = api

    this._modelRegistry = modelRegistry || new Map()
    this._modelClassCache = new Map()
    this._modelCache = new Map()

    document.on('document:changed', this._invalidateDeletedModels, this)
  }

  dispose () {
    this._modelCache.clear()
  }

  getModelById (id) {
    let node = this._document.get(id)
    if (node) {
      let cachedModel = this._modelCache.get(node.id)
      // ATTENTION: making sure that the node is
      if (cachedModel) return cachedModel
      let model = this._createModelForNode(node)
      this._modelCache.set(node.id, model)
      return model
    }
  }

  _invalidateDeletedModels (change) {
    for (let op of change.ops) {
      if (op.isDelete()) {
        this._modelCache.delete(op.getValue().id)
      }
    }
  }

  _createModelForNode (node) {
    let api = this._api
    let ModelClass = this._modelClassCache.get(node.type)
    if (!ModelClass) {
      ModelClass = generateModelClass(node.getSchema())
      if (this._modelRegistry.has(node.type)) {
        let extension = this._modelRegistry.get(node.type)
        ModelClass = extension(ModelClass)
      }
      this._modelClassCache.set(node.type, ModelClass)
    }
    return new ModelClass(api, node)
  }
}
