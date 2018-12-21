import NodeModel from './NodeModel'

export default class ModelFactory {
  constructor (document, api) {
    this._document = document
    this._api = api

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
      class Model extends NodeModel {}
      let nodeSchema = node.getSchema()
      for (let prop of nodeSchema) {
        // skip id and type
        if (prop.name === 'id') continue
        Model.prototype[_modelGetter(prop.name)] = function () {
          return this._propertyModels.get(prop.name)
        }
        if (!prop.isReference()) {
          Object.defineProperty(Model.prototype, prop.name, {
            get () { return this._node[prop.name] }
          })
        } else {

        }
      }
      ModelClass = Model
      this._modelClassCache.set(node.type, ModelClass)
    }
    return new ModelClass(api, node)
  }
}

function _propGetter (name) {
  return ['get', name[0].toUpperCase(), name.slice(1)].join('')
}

function _modelGetter (name) {
  return _propGetter(name) + 'Model'
}
