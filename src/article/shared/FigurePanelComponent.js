import { Component } from 'substance'
import { ModelComponent } from '../../kit'
import { PREVIEW_MODE, METADATA_MODE } from '../ArticleConstants'
import FigureMetadataComponent from './FigureMetadataComponent'
import PreviewComponent from './PreviewComponent'

export default class FigurePanelComponent extends ModelComponent {
  render ($$) {
    const mode = this._getMode()
    // different rendering when rendered as preview or in metadata view
    if (mode === PREVIEW_MODE) {
      return this._renderPreviewVersion($$)
    } else if (mode === METADATA_MODE) {
      return this._renderMetadataVersion($$)
    }

    const model = this.props.model
    const titleModel = model.getTitleModel()
    const contentModel = model.getContentModel()
    const captionModel = model.getCaptionModel()
    const TitleComponent = this.getComponentForModel(titleModel)
    const ContentComponent = this.getComponentForModel(contentModel)
    const CaptionComponent = this.getComponentForModel(captionModel)
    const SectionLabel = this.getComponent('section-label')

    let el = $$('div')
      .addClass(this._getClassNames())
      .attr('data-id', model.id)
      .addClass(`sm-${mode}`)
      .addClass()

    el.append(
      $$(SectionLabel, {label: 'label-label'}),
      $$(FigurePanelLabelComponent, { model }).ref('label'),
      $$(ContentComponent, { model: contentModel }).ref('content').addClass('se-content'),
      $$(SectionLabel, {label: 'title-label'}),
      $$(TitleComponent, { model: titleModel }).ref('title').addClass('se-title'),
      $$(SectionLabel, {label: 'caption-label'}),
      $$(CaptionComponent, { model: captionModel }).ref('caption').addClass('se-caption')
    )

    return el
  }

  _getClassNames () {
    return `sc-figure-panel sm-${this.props.model.getContentModel().type}`
  }

  _renderPreviewVersion ($$) {
    const model = this.props.model
    const contentModel = this.props.model.getContentModel()
    const ContentComponent = this.getComponentForModel(contentModel)
    // TODO: We could return the PreviewComponent directly.
    // However this yields an error we need to investigate.
    let thumbnail
    if (contentModel.type === 'graphic') {
      thumbnail = $$(ContentComponent, {
        model: contentModel
      }).ref('content')
    }
    // TODO: PreviewComponent should work with a model
    // FIXME: there is problem with redirected components
    // and Component as props
    return $$('div').append($$(PreviewComponent, {
      id: model.id,
      thumbnail,
      label: model.label
    }))
  }

  _renderMetadataVersion ($$) {
    return $$(FigureMetadataComponent, { model: this.props.model }).ref('metadata')
  }

  _getMode () {
    return this.props.mode || 'manuscript'
  }
}

class FigurePanelLabelComponent extends Component {
  didMount () {
    this.context.appState.addObserver(['document'], this.rerender, this, { stage: 'render', document: { path: [this.props.model.id] } })
  }

  dispose () {
    this.context.appState.removeObserver(this)
  }

  render ($$) {
    const label = this.props.model.label
    return $$('div').addClass('se-label').text(label)
  }
}
