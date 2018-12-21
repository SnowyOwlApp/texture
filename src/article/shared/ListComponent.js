import { isString, renderListNode } from 'substance'
import { NodeComponent } from '../../kit'

export default class ListComponent extends NodeComponent {
  render ($$) {
    const ListItemComponent = this.getComponent('list-item')
    let model = this.props.model
    let node = model.getNode()
    // TODO: is it ok to rely on Node API here?
    let el = renderListNode(node, item => {
      // item is either a list item node, or a tagName
      if (isString(item)) {
        return $$(item)
      } else if (item.type === 'list-item') {
        let itemModel = model._api.getModelById(item.id)
        return $$(ListItemComponent, {
          model: itemModel
        }).ref(item.id)
      }
    })
    el.addClass('sc-list').attr('data-id', node.id)
    return el
  }

  // we need this ATM to prevent this being wrapped into an isolated node (see ContainerEditor._renderNode())
  get _isCustomNodeComponent () { return true }
}
