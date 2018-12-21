import { ModelComponent } from '../../kit'

export default class BlockQuoteComponent extends ModelComponent {
  render ($$) {
    let model = this.props.model
    let contentModel = model.getContentModel()
    let attribModel = model.getAttribModel()
    let ContentComponent = this.getComponentForModel(contentModel)
    let AttribComponent = this.getComponentForModel(attribModel)
    let el = $$('div')
      .addClass('sc-block-quote')
      .attr('data-id', model.id)

    el.append(
      $$(ContentComponent, {
        model: contentModel,
        // TODO: use label provider
        placeholder: 'Enter attribution'
      }).ref('content'),
      $$(AttribComponent, {
        model: attribModel,
        // TODO: use label provider
        placeholder: 'Enter attribution'
      }).ref('attrib')
    )
    return el
  }
}
