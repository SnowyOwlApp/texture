import { Command } from 'substance'

class BasicCollectionCommand extends Command {
  constructor (...args) {
    super(...args)

    // EXPERIMENTAL: 'pre-compiling' a selector for the current xpath
    // later this selector will be compiled by the CommandManager, and commands be inhibited if the selector does not match current xpath
    // for now we only support '<type>.<property>' as selector format. Later this will be extended as we need it.
    let xpathSelector = this.config.xpathSelector
    if (xpathSelector) {
      // ATTENTION: this is not ready for any other format than '<type>.<property>'
      let [type, property] = xpathSelector.split('.')
      this._contextSelector = { type, property }
    }
  }

  getCommandState (params, context) {
    let { collection, item, position } = this._detectCollection(params, context)
    return { disabled: (!collection || !item), collection, item, position }
  }

  _detectCollection (params, context) {
    let selectionState = params.selectionState
    let xpath = selectionState.xpath
    if (this._contextSelector && xpath.length > 0) {
      let api = context.api
      let idx = xpath.findIndex(x => x.type === this._contextSelector.type)
      let first = xpath[idx]
      let second = xpath[idx + 1]
      if (first && second.property === this._contextSelector.property) {
        let collection = api.getModelById(first.id).getPropertyModel(second.property)
        let item = api.getModelById(second.id)
        let position = -1
        if (item) {
          position = item.getNode().getPosition()
        }
        return { collection, item, position }
      }
    }
    return {}
  }

  _getItemPosition (item) {
    let itemNode = item._node
    return itemNode.getPosition()
  }
}

export class RemoveCollectionItemCommand extends BasicCollectionCommand {
  execute (params, context) {
    const { collection, item } = params.commandState
    collection.removeItem(item)
  }
}

export class MoveCollectionItemCommand extends BasicCollectionCommand {
  getCommandState (params, context) {
    let commandState = super.getCommandState(params, context)
    if (!commandState.disabled) {
      // check the posision
      const direction = this.config.direction
      const { collection, position } = commandState
      if (
        (direction === 'up' && position === 0) ||
        (direction === 'down' && position === collection.length - 1)
      ) {
        commandState.disabled = true
      }
    }
    return commandState
  }

  execute (params, context) {
    const direction = this.config.direction
    const { collection, item } = params.commandState
    if (direction === 'up') {
      collection.moveUp(item)
    } else if (direction === 'down') {
      collection.moveDown(item)
    }
  }
}
