import { Component } from 'substance'
import DefaultModelComponent from '../shared/DefaultModelComponent'
import CardComponent from '../shared/CardComponent'

export default class EditReferenceWorkflow extends Component {
  constructor (...args) {
    super(...args)
    this.handleActions({
      'remove-item': this._removeReference
    })
  }

  render ($$) {
    const model = this.props.model
    const ItemEditor = this.getComponent(model.type, true) || DefaultModelComponent

    let el = $$('div').addClass('se-edit-reference').append(
      $$(CardComponent, { model }).append(
        $$(ItemEditor, { model })
      )
    )

    return el
  }

  // TODO: do the action inside the API
  _removeReference (model) {
    const api = this.context.api
    const references = api.getModelById('references')
    references.removeItem(model)
    this.send('closeModal')
  }
}
