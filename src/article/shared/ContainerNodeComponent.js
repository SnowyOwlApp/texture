import { Component } from 'substance'

// TODO: try to get rid of this by using a FlowContentModel
export default class ContainerNodeComponent extends Component {
  render ($$) {
    const node = this.props.node
    const ContainerEditor = this.getComponent('container-editor')
    let el = $$('div')
      // TODO: don't violate the 'sc-' contract
      .addClass('sc-' + node.type)
      .attr('data-id', node.id)
    el.append($$(ContainerEditor, {
      placeholder: this.props.placeholder,
      name: this.props.name,
      containerPath: node.getContentPath(),
      disabled: this.props.disabled
    }).ref('container'))
    // TODO: ability to edit attributes
    return el
  }
}
