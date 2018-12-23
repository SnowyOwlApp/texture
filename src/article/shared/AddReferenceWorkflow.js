import { Component } from 'substance'
import DOIInputComponent from './DOIInputComponent'
import ReferenceUploadComponent from './ReferenceUploadComponent'
import { INTERNAL_BIBR_TYPES } from '../ArticleConstants'

export default class AddReferenceWorkflow extends Component {
  didMount () {
    super.didMount()

    this.handleActions({
      'importBib': this._onImport
    })
  }

  render ($$) {
    const labelProvider = this.context.labelProvider

    let el = $$('div').addClass('se-add-reference')

    const title = $$('div').addClass('se-title').append(
      labelProvider.getLabel('add-reference-title')
    )

    const manualAddEl = $$('div').addClass('se-manual-add').append(
      $$('div').addClass('se-section-title').append(
        labelProvider.getLabel('add-ref-manually')
      )
    )

    const refTypesButtons = $$('ul').addClass('se-reftypes-list')
    INTERNAL_BIBR_TYPES.forEach(item => {
      refTypesButtons.append(
        $$('li').addClass('se-type sm-' + item).append(
          labelProvider.getLabel(item)
        ).on('click', this._onAdd.bind(this, item))
      )
    })
    manualAddEl.append(refTypesButtons)

    el.append(
      title,
      $$(DOIInputComponent),
      $$(ReferenceUploadComponent),
      manualAddEl
    )

    return el
  }

  _onImport (items) {
    const api = this.context.api
    api.addReferences(items)
    this.send('closeModal')
  }

  _onAdd (type) {
    const api = this.context.api
    api.addReference({type})
    this.send('closeModal')
  }
}
