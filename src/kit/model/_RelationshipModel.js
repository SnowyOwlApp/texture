import ValueModel from './ValueModel'

// TODO: this does not seem to be the right approach
// We have taken this too far, i.e. trying to generate an editor
// for reference properties without ownership (aka relationships)
export default class _RelationshipModel extends ValueModel {
  constructor (api, path, targetTypes) {
    super(api, path)

    this._targetTypes = targetTypes
  }

  getAvailableTargets () {
    return _getAvailableRelationshipOptions(this._api, this._targetTypes)
  }
}

function _getAvailableRelationshipOptions (api, targetTypes) {
  console.error('FIXME: RelationshipModel.getAvailableTargets() has to be rewritten')
  return []
  // let items = targetTypes.reduce((items, targetType) => {
  //   let collection = api.getCollectionForType(targetType)
  //   return items.concat(collection.getItems())
  // }, [])
  // return items.map(item => _getRelationshipOption(api, item.id))
}

// function _getRelationshipOption (api, id) {
//   return {
//     id,
//     toString () {
//       return api.renderEntity(api.getModelById(id))
//     }
//   }
// }
