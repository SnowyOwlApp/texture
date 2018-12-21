import { ModelComponent } from '../../kit'
import { getXrefLabel } from './xrefHelpers'

export default class XrefComponent extends ModelComponent {
  render ($$) {
    let model = this.props.model
    let refType = model.refType
    let label = getXrefLabel(model)
    let el = $$('span').addClass('sc-xref sm-' + refType)
    if (!label) {
      el.addClass('sm-no-label')
      el.append('?')
    } else {
      el.append(label)
    }
    return el
  }
}
