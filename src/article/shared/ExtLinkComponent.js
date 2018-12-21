import { AnnotationComponent } from 'substance'
import { NodeComponentMixin } from '../../kit'

export default class ExtLinkComponent extends NodeComponentMixin(AnnotationComponent) {
  render ($$) {
    let model = this.props.model
    let el = super.render($$)
    el.attr('href', model.href)
    return el
  }

  getTagName () {
    return 'a'
  }
}
