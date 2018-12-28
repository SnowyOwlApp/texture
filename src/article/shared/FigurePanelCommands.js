import { Command } from 'substance'
import { findParentByType } from './nodeHelpers'

class BasicFigurePanelCommand extends Command {
  getCommandState (params, context) {
    return {
      disabled: this.isDisabled(params, context)
    }
  }

  isDisabled (params) {
    const xpath = params.selectionState.xpath
    return !xpath.find(n => n.type === 'figure')
  }

  _getFigureModel (params, context) {
    const api = context.api
    const sel = params.selection
    const doc = params.editorSession.getDocument()
    let nodeId = sel.getNodeId()
    const selectedNode = doc.get(nodeId)
    if (selectedNode.type !== 'figure') {
      const node = findParentByType(selectedNode, 'figure')
      nodeId = node.id
    }
    return api.getModelById(nodeId)
  }

  _matchSelection (params, context) {
    const xpath = params.selectionState.xpath
    const isInFigure = xpath.find(n => n.type === 'figure')
    // TODO: why is this necessary? figure panels should always be inside figure
    // const isFigurePanel = xpath[xpath.length - 1].type === 'figure-panel'
    // const viewName = context.appState.viewName
    // return viewName === 'metadata' ? isFigurePanel : isInFigure
    return isInFigure
  }
}

export class AddFigurePanelCommand extends BasicFigurePanelCommand {
  execute (params, context) {
    const figureModel = this._getFigureModel(params, context)
    const files = params.files
    if (files.length > 0) {
      figureModel.addPanel(files[0])
    }
  }
}

export class ReplaceFigurePanelImageCommand extends BasicFigurePanelCommand {
  execute (params, context) {
    const figurePanelModel = this._getFigurePanelModel(params, context)
    const files = params.files
    if (files.length > 0) {
      figurePanelModel.replaceImage(files[0])
    }
  }

  isDisabled (params, context) {
    const matchSelection = this._matchSelection(params, context)
    if (matchSelection) return false
    return true
  }

  _getFigurePanelModel (params, context) {
    const figureModel = this._getFigureModel(params, context)
    const currentIndex = figureModel.getCurrentPanelIndex()
    const panelsCollection = figureModel.getPanelsModel()
    return panelsCollection.getItemAt(currentIndex)
  }
}

export class RemoveFigurePanelCommand extends BasicFigurePanelCommand {
  execute (params, context) {
    const figureModel = this._getFigureModel(params, context)
    figureModel.removePanel()
  }

  isDisabled (params, context) {
    const matchSelection = this._matchSelection(params, context)
    if (matchSelection) {
      const figureModel = this._getFigureModel(params, context)
      const panelsCollection = figureModel.getPanelsModel()
      if (panelsCollection.length > 1) {
        return false
      }
    }
    return true
  }
}

export class MoveFigurePanelCommand extends BasicFigurePanelCommand {
  execute (params, context) {
    const direction = this.config.direction
    const figureModel = this._getFigureModel(params, context)
    if (direction === 'up') {
      figureModel.movePanelUp()
    } else if (direction === 'down') {
      figureModel.movePanelDown()
    }
  }

  isDisabled (params, context) {
    const matchSelection = this._matchSelection(params, context)
    if (matchSelection) {
      const figureModel = this._getFigureModel(params, context)
      const panelsCollection = figureModel.getPanelsModel()
      const currentIndex = figureModel.getCurrentPanelIndex()
      const panelsLength = panelsCollection.length
      const direction = this.config.direction
      if (panelsLength > 1) {
        if ((direction === 'up' && currentIndex > 0) || (direction === 'down' && currentIndex < panelsLength - 1)) {
          return false
        }
      }
    }
    return true
  }
}
