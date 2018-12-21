import { ModelComponent } from '../../kit'
import { getLabel } from './nodeHelpers'
import { PREVIEW_MODE } from '../ArticleConstants'
import PreviewComponent from './PreviewComponent'

export default class FootnoteComponent extends ModelComponent {
  render ($$) {
    const mode = this.props.mode
    const footnote = this.props.model
    const contentModel = footnote.getContentModel()
    const ContentComponent = this.getComponentForModel(contentModel)

    let el = $$('div')
      .addClass('sc-footnote')
      .attr('data-id', footnote.id)

    let label = getLabel(footnote) || '?'

    if (mode === PREVIEW_MODE) {
      el.append(
        $$(PreviewComponent, {
          id: footnote.id,
          label: label,
          description: $$(ContentComponent, {
            model: contentModel,
            disabled: true,
            editable: false
          })
        })
      )
    } else {
      let fnContainer = $$('div').addClass('se-container')
      el.append(
        fnContainer.append(
          $$('div').addClass('se-label').append(
            label
          ),
          $$(ContentComponent, {
            placeholder: 'Enter Footnote',
            model: contentModel,
            disabled: this.props.disabled
          }).ref('editor')
        )
      )
    }
    return el
  }
}
