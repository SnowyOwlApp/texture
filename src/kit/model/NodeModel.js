import createValueModel from './createValueModel'
import { isFlowContentEmpty } from './modelHelpers'
import AbstractModel from './AbstractModel'
import CollectionValueModel from './CollectionValueModel'

export default class NodeModel extends AbstractModel {
  constructor (api, node) {
    super(api)
    if (!node) throw new Error("'node' is required")
    this._node = node
    this._propertyModels = new Map()
    this._initialize()
  }

  get type () { return this._node.type }

  get id () { return this._node.id }

  getState () {
    return this._node.state
  }

  toJSON () {
    return this._node.toJSON()
  }

  getNode () {
    return this._node
  }

  isEmpty () {
    const node = this._node
    // TODO: what does isEmpty() mean on a general node?
    // ATM we assume that this only makes sense for TextNodes and Containers
    if (node.isText()) {
      return node.isEmpty()
    } else if (node.isContainer()) {
      return isFlowContentEmpty(this._api, node.getContentPath())
    }
    return false
  }

  [Symbol.iterator] () {
    return this._propertyModels[Symbol.iterator]()
  }

  _initialize () {
    const node = this._node
    const nodeSchema = node.getSchema()
    for (let prop of nodeSchema) {
      if (prop.name === 'id') continue
      let valueModel = this._createValueModel(prop)
      this._propertyModels.set(prop.name, valueModel)
    }
  }

  _getPropertyModel (name) {
    return this._propertiesByName.get(name)
  }

  _createValueModel (property) {
    const api = this._api
    const node = this._node
    let name = property.name
    const path = [this._node.id, name]
    if (property.isReference() && property.isOwned()) {
      if (property.isArray()) {
        return new CollectionValueModel(api, path, property.targetTypes)
      } else {
        return api.getModelById(node[name])
      }
    }
    let type = property.type
    if (property.isReference()) {
      if (property.isArray()) {
        type = 'many-relationship'
      } else {
        type = 'single-relationship'
      }
    }
    return createValueModel(api, type, path, property.targetTypes)
  }
}
