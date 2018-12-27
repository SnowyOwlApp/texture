import { ModelComponent } from '../../kit'
import { PREVIEW_MODE, METADATA_MODE } from '../ArticleConstants'
import { getLabel } from './nodeHelpers'
import PreviewComponent from './PreviewComponent'
import DefaultModelComponent from './DefaultModelComponent'
import InplaceRefContribEditor from '../metadata/InplaceRefContribEditor'

export default class ReferenceComponent extends ModelComponent {
  render ($$) {
    let mode = this.props.mode
    let model = this.props.model
    let label = this._getReferenceLabel()
    // TODO: this should also use model
    let html = this.context.api.renderEntity(model.getNode())
    // TODO: use the label provider
    html = html || '<i>Not available</i>'
    if (mode === PREVIEW_MODE) {
      // NOTE: We return PreviewComponent directly, to prevent inheriting styles from .sc-reference
      return $$(PreviewComponent, {
        id: model.id,
        label,
        description: $$('div').html(html)
      })
    } else if (mode === METADATA_MODE) {
      return $$(ReferenceMetadataComponent, { model })
    } else {
      let el = $$('div').addClass('sc-reference')
      el.append(
        $$('div').addClass('se-label').append(label),
        $$('div').addClass('se-text').html(html)
      ).attr('data-id', model.id)
      return el
    }
  }

  _getReferenceLabel () {
    return getLabel(this.props.model) || '?'
  }
}

class ReferenceMetadataComponent extends DefaultModelComponent {
  _getClassNames () {
    return 'sc-reference'
  }
  // using a special inplace property editor for 'ref-contrib's
  _getPropertyEditorClass (model, name) {
    if (name === 'authors' || name === 'editors') {
      return InplaceRefContribEditor
    } else {
      return super._getPropertyEditorClass(model, name)
    }
  }
}
