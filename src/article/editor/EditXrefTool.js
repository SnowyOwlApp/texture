import { ToggleTool } from '../../kit'
import renderModelComponent from '../shared/renderModelComponent'
import { PREVIEW_MODE } from '../../article/ArticleConstants'

export default class EditXRefTool extends ToggleTool {
  render ($$) {
    const targets = this._getAvailableTargets()

    let el = $$('div').addClass('sc-edit-xref-tool')
    // ATTENTION the targets are not models or nodes, but entries
    // created by xrefHelpers
    // TODO: use something more idiomatic
    for (let entry of targets) {
      const target = entry.model
      if (!target) continue
      const selected = entry.selected
      let targetPreviewEl = this._renderOption($$, target, selected)
      targetPreviewEl.on('click', this._toggleTarget.bind(this, target.id), this)
      el.append(targetPreviewEl)
    }
    return el
  }

  _renderOption ($$, target, selected) {
    let optionEl = $$('div').addClass('se-option').append(
      renderModelComponent(this.context, $$, {
        model: target,
        mode: PREVIEW_MODE
      })
    )
    if (selected) {
      optionEl.addClass('sm-selected')
    }
    return optionEl
  }

  _getModel () {
    // TODO: we should name this 'modelId'
    let id = this.props.commandState.nodeId
    return this.context.api.getModelById(id)
  }

  _getAvailableTargets () {
    let model = this._getModel()
    return this.context.api._getAvailableTargets(model)
  }

  _toggleTarget (targetNodeId, e) {
    // Make sure we don't follow external links
    e.preventDefault()
    e.stopPropagation()
    let model = this._getModel()
    let targets = this.context.api._toggleXrefTarget(model, targetNodeId)
    this.setState({
      targets
    })
  }
}
