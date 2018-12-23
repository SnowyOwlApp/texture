import _ContainerModel from './_ContainerModel'

// TODO: We need to refactor the general Model API
// I want to use only ValueModels, and Models that are derived from the schema automatically.
// Instead if maintaining a model class for every single concept, I want to stream-line the document schema,
// and use a generated Model API. For instance, the panels of a figure will not be an extra node, and a Figure is
// would either be a Collection of FigurePanel, or it would own a property 'panels' of type collection.
// I'd prefer the latter, because it is more general. Then, instead of figure.addPanel()
// one would need to use figure.getPanels().addItem()
export default class CollectionValueModel extends _ContainerModel {
  get type () {
    return 'collection'
  }

  getItems () {
    return this._getItems()
  }

  getItemAt (idx) {
    let ids = this.getValue()
    let id = ids[idx]
    if (id) {
      return this._api.getModelById(id)
    }
  }

  getItemIds () {
    return this.getValue()
  }

  addItem (data = {}) {
    // FIXME: here we need to seed the data
    if (!data.type) {
      data.type = this._targetTypes[0]
    }
    return this._api.addItemToCollection(data, this)
  }

  removeItem (item) {
    return this._api.removeItemFromCollection(item, this)
  }

  get _isCollectionValueModel () {
    return true
  }
}
