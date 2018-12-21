import { ModelComponent } from '../../kit'

export default class ListItemComponent extends ModelComponent {
  render ($$) {
    const model = this.props.model
    const contentModel = model.getContentModel()
    const ContentComponent = this.getComponentForModel(contentModel)
    let el = $$('li').addClass('sc-list-item')
    el.append(
      $$(ContentComponent, {
        model: contentModel
      }).ref('text')
    )
    // for nested lists
    if (this.props.children) {
      el.append(this.props.children)
    }
    return el
  }
}
