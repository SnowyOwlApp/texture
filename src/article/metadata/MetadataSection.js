import { ModelComponent } from '../../kit'
// import CardComponent from '../shared/CardComponent'
import CollectionEditor from './CollectionEditor'

export default class MetadataSection extends ModelComponent {
  render ($$) {
    const model = this.props.model
    const name = this.props.name
    // const label = this.getLabel(model.id)
    let el = $$('div').addClass('sc-metadata-section').addClass(`sm-${name}`)
    if (model.type === 'collection') {
      el.append($$(CollectionEditor, { model }))
    } else {
      let label = this.getLabel(model.type)
      let CustomEditor = this.getComponent(model.type)
      el.append(
        $$('div').addClass('se-heading').append(
          $$('div').addClass('se-header').append(label)
        ),
        $$(CustomEditor, { model }).ref('editor')
      )
    }
    // let ModelEditor = this.getComponent(model.type, true)
    // if (!ModelEditor) ModelEditor = isCollection ? this.getComponent('collection') : this.getComponent('entity')
    // let modelEl = $$(ModelEditor, { model }).ref('editor')
    // // non-collection models are wrapped in a Card
    // if (isCollection) {
    //   const items = model.getItems()
    //   if (items.length > 0) {
    //     el.append(
    //       $$('div').addClass('se-heading').append(
    //         $$('div').addClass('se-header').append(label)
    //       ),
    //       modelEl
    //     )
    //   }
    // } else {
    //   el.append(
    //     $$('div').addClass('se-heading').append(
    //       $$('div').addClass('se-header').append(label)
    //     ),
    //     $$(CardComponent, { model }).append(modelEl)
    //   )
    // }
    return el
  }
}
