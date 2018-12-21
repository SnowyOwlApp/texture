import { ModelComponent } from '../../kit'
import { getXrefLabel } from './xrefHelpers'

export default class XrefComponent extends ModelComponent {
  render ($$) {
    let model = this.props.model
    let refType = model.refType
    let label = getXrefLabel(model)
    return $$('span').addClass('sc-xref sm-' + refType).append(label)
  }
}
