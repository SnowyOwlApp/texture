import { DefaultDOMElement } from 'substance'
import { ModelComponent } from '../../kit'
import { PREVIEW_MODE } from '../../article/ArticleConstants'

export default class FigureComponent extends ModelComponent {
  /*
    Note: in the Manuscript View only one figure panel is shown at time.
  */
  render ($$) {
    let mode = this._getMode()
    let model = this.props.model
    let panels = model.panels

    let el = $$('div').addClass('sc-figure').addClass(`sm-${mode}`).attr('data-id', model.id)

    if (panels.length > 0) {
      let content = this._renderCarousel($$, panels)
      el.append(content)
    }

    return el
  }

  _renderCarousel ($$, panels) {
    if (panels.length === 1) {
      return this._renderCurrentPanel($$)
    } else {
      return $$('div').addClass('se-carousel').append(
        $$('div').addClass('se-current-panel').append(
          this._renderCurrentPanel($$)
        ),
        $$('div').addClass('se-thumbnails').append(
          this._renderThumbnails($$)
        )
      )
    }
  }

  _renderCurrentPanel ($$) {
    let panel = this._getCurrentPanel()
    let PanelComponent = this.getComponentForModel(panel)
    return $$(PanelComponent, {
      model: panel,
      mode: this.props.mode
    })
  }

  _renderThumbnails ($$) {
    const model = this.props.model
    const panels = model.panels
    const currentIndex = this._getCurrentPanelIndex()
    return panels.map((panel, idx) => {
      let PanelComponent = this.getComponentForModel(panel)
      const thumbnail = $$(PanelComponent, {
        model: panel,
        mode: PREVIEW_MODE
      })
      if (currentIndex === idx) {
        thumbnail.addClass('sm-current-panel')
      } else {
        thumbnail.on('click', this._handleThumbnailClick)
      }
      return thumbnail
    })
  }

  _getMode () {
    return this.props.mode || 'manuscript'
  }

  _getCurrentPanel () {
    let model = this.props.model
    let currentPanelIndex = this._getCurrentPanelIndex()
    let panelsCollection = model.getPanelsModel()
    return panelsCollection.getItemAt(currentPanelIndex)
  }

  _getCurrentPanelIndex () {
    let model = this.props.model
    let state = model.getState()
    let panelsCollection = model.getPanelsModel()
    let currentPanelIndex = 0
    if (state) {
      currentPanelIndex = state.currentPanelIndex
    }
    // FIXME: state is corrupt
    if (currentPanelIndex < 0 || currentPanelIndex >= panelsCollection.length) {
      console.error('figurePanel.state.currentPanelIndex is corrupt')
      state.currentPanelIndex = currentPanelIndex = 0
    }
    return currentPanelIndex
  }

  _handleThumbnailClick (e) {
    const model = this.props.model
    const panelIds = model.getPanelsModel().getItemIds()
    // ATTENTION: wrap the native element here so that this works for testing too
    let target = DefaultDOMElement.wrap(e.currentTarget)
    const panelId = target.getAttribute('data-id')
    if (panelId) {
      const editorSession = this.context.editorSession
      editorSession.updateNodeStates([[model.id, {currentPanelIndex: panelIds.indexOf(panelId)}]])
    }
  }
}
