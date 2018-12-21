import { ModelComponent } from '../../kit'

export default class ContentComponent extends ModelComponent {
  render ($$) {
    let model = this.props.model
    let content = model.getContentModel()
    let ContentComponent = this.getComponentForModel(content)
    let el = $$('div').addClass(this._getClassNames())
    el.append(
      $$(ContentComponent, { model: content }).ref('content')
    )
    return el
  }

  _getClassNames () {
    return 'sc-content'
  }
}
