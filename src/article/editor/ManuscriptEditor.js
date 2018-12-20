import { DefaultDOMElement } from 'substance'
import { Managed } from '../../kit'
import EditorPanel from '../shared/EditorPanel'
import TOCProvider from './TOCProvider'
import TOC from './TOC'

export default class ManuscriptEditor extends EditorPanel {
  getActionHandlers () {
    return Object.assign(super.getActionHandlers(), {
      tocEntrySelected: this._tocEntrySelected
    })
  }

  _initialize (props) {
    super._initialize(props)

    this.tocProvider = this._getTOCProvider()
    this.context.tocProvider = this.tocProvider
  }

  didMount () {
    super.didMount()

    this.tocProvider.on('toc:updated', this._showHideTOC, this)
    this._showHideTOC()
    this._restoreViewport()

    DefaultDOMElement.getBrowserWindow().on('resize', this._showHideTOC, this)
  }

  didUpdate () {
    super.didUpdate()

    this._showHideTOC()
    this._restoreViewport()
  }

  dispose () {
    super.dispose()

    this.tocProvider.off(this)
    DefaultDOMElement.getBrowserWindow().off(this)
  }

  render ($$) {
    let el = $$('div').addClass('sc-manuscript-editor')
      // sharing styles with sc-article-reader
      .addClass('sc-manuscript-view')
    el.append(
      this._renderMainSection($$),
      this._renderContextPane($$)
    )
    el.on('keydown', this._onKeydown)
    return el
  }

  _renderMainSection ($$) {
    const appState = this.context.appState
    let mainSection = $$('div').addClass('se-main-section')
    mainSection.append(
      this._renderToolbar($$),
      $$('div').addClass('se-content-section').append(
        this._renderTOCPane($$),
        this._renderContentPanel($$)
      ).ref('contentSection'),
      this._renderFooterPane($$)
    )

    if (appState.workflowId) {
      let Modal = this.getComponent('modal')
      let WorkflowComponent = this.getComponent(appState.workflowId)
      let workflowModal = $$(Modal).addClass('se-workflow-modal sm-workflow-' + appState.workflowId).append(
        $$(WorkflowComponent, appState.workflowProps).ref('workflow')
      )
      mainSection.append(workflowModal)
    }

    return mainSection
  }

  _renderTOCPane ($$) {
    let el = $$('div').addClass('se-toc-pane').ref('tocPane')
    el.append(
      $$('div').addClass('se-context-pane-content').append(
        $$(TOC)
      )
    )
    return el
  }

  _renderToolbar ($$) {
    const Toolbar = this.getComponent('toolbar')
    const configurator = this._getConfigurator()
    const toolPanel = configurator.getToolPanel('toolbar', true)
    return $$('div').addClass('se-toolbar-wrapper').append(
      $$(Managed(Toolbar), {
        toolPanel,
        bindings: ['commandStates']
      }).ref('toolbar')
    )
  }

  _renderContentPanel ($$) {
    const configurator = this._getConfigurator()
    const ScrollPane = this.getComponent('scroll-pane')
    const ManuscriptComponent = this.getComponent('manuscript')
    const Overlay = this.getComponent('overlay')
    const ContextMenu = this.getComponent('context-menu')
    const Dropzones = this.getComponent('dropzones')

    let contentPanel = $$(ScrollPane, {
      tocProvider: this.tocProvider,
      // scrollbarType: 'substance',
      contextMenu: 'custom',
      scrollbarPosition: 'right'
    }).ref('contentPanel')

    contentPanel.append(
      $$(ManuscriptComponent, {
        model: this.api.getModelById('article'),
        disabled: this.props.disabled
      }).ref('article'),
      $$(Managed(Overlay), {
        toolPanel: configurator.getToolPanel('main-overlay'),
        theme: this._getTheme(),
        bindings: ['commandStates']
      }),
      $$(Managed(ContextMenu), {
        toolPanel: configurator.getToolPanel('context-menu'),
        theme: this._getTheme(),
        bindings: ['commandStates']
      }),
      $$(Dropzones)
    )
    return contentPanel
  }

  _renderFooterPane ($$) {
    const FindAndReplaceDialog = this.getComponent('find-and-replace-dialog')
    let el = $$('div').addClass('se-footer-pane')
    el.append(
      $$(FindAndReplaceDialog, {
        theme: this._getTheme(),
        viewName: 'manuscript'
      }).ref('findAndReplace')
    )
    return el
  }

  _renderContextPane ($$) {
    // TODO: we need to revisit this
    // We have introduced this to be able to inject a shared context panel
    // in Stencila. However, ATM we try to keep the component
    // as modular as possible, and avoid these kind of things.
    if (this.props.contextComponent) {
      let el = $$('div').addClass('se-context-pane')
      el.append(
        $$('div').addClass('se-context-pane-content').append(
          this.props.contextComponent
        )
      )
      return el
    }
  }

  _getContentPanel () {
    return this.refs.contentPanel
  }

  getViewport () {
    return {
      x: this.refs.contentPanel.getScrollPosition()
    }
  }

  _tocEntrySelected (nodeId) {
    let contentElement
    switch (nodeId) {
      // scroll to the section label for the all the higher-level sections
      case 'title':
      case 'abstract':
      case 'body':
      case 'footnotes':
      case 'references': {
        let sectionComponent = this._getContentPanel().find(`.sc-section-label.sm-${nodeId}`).el
        contentElement = sectionComponent.el
        break
      }
      default: {
        let nodeComponent = this._getContentPanel().find(`[data-id="${nodeId}"]`)
        contentElement = nodeComponent.el
      }
    }
    // Note: doing a forced scroll, i.e. not only if target is not visible
    return this._scrollElementIntoView(contentElement, true)
  }

  _showHideTOC () {
    let contentSectionWidth = this.refs.contentSection.el.width
    if (!this._isTOCVisible() || contentSectionWidth < 960) {
      this.el.addClass('sm-compact')
    } else {
      this.el.removeClass('sm-compact')
    }
  }

  _isTOCVisible () {
    let entries = this.tocProvider.getEntries()
    return entries.length >= 2
  }

  _getTOCProvider () {
    return new TOCProvider(this.editorSession, { containerId: 'body' })
  }
}
