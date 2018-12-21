import { AnnotationComponent } from 'substance'

import AbstractComponent from './AbstractComponent'
import AuthorsListComponent from './AuthorsListComponent'
import BreakComponent from './BreakComponent'
import BlockFormulaComponent from './BlockFormulaComponent'
import BlockQuoteComponent from './BlockQuoteComponent'
import BodyComponent from './BodyComponent'
import ExternalLinkComponent from './ExternalLinkComponent'
import FigureComponent from './FigureComponent'
import FigurePanelComponent from './FigurePanelComponent'
import FootnoteComponent from './FootnoteComponent'
import HeadingComponent from './HeadingComponent'
import InlineFormulaComponent from './InlineFormulaComponent'
import ListComponent from './ListComponent'
import ListItemComponent from './ListItemComponent'
import ManuscriptComponent from './ManuscriptComponent'
import ModelPreviewComponent from './ModelPreviewComponent'
import ParagraphComponent from './ParagraphComponent'
import ReferenceComponent from './ReferenceComponent'
import ReferenceListComponent from './ReferenceListComponent'
import SectionLabel from './SectionLabel'
import TableComponent from './TableComponent'
import TableFigureComponent from './TableFigureComponent'
import UnsupportedNodeComponent from './UnsupportedNodeComponent'
import UnsupportedInlineNodeComponent from './UnsupportedInlineNodeComponent'
import XrefComponent from './XrefComponent'

// TODO: see which we really need
import AffiliationsListComponent from './AffiliationsListComponent'
import BioComponent from './BioComponent'
import DefaultModelComponent from './DefaultModelComponent'
import EditorsListComponent from './EditorsListComponent'
import CaptionComponent from './CaptionComponent'
import ContainerNodeComponent from './ContainerNodeComponent'
import GraphicComponent from './GraphicComponent'
import SigBlockComponent from './SigBlockComponent'

export default {
  name: 'manuscript-content',
  configure (config) {
    config.addComponent('abstract', AbstractComponent)
    config.addComponent('authors-list', AuthorsListComponent)
    config.addComponent('bold', AnnotationComponent)
    config.addComponent('block-formula', BlockFormulaComponent)
    config.addComponent('block-quote', BlockQuoteComponent)
    config.addComponent('break', BreakComponent)
    config.addComponent('reference', ReferenceComponent)
    config.addComponent('body', BodyComponent)
    config.addComponent('external-link', ExternalLinkComponent)
    config.addComponent('figure', FigureComponent)
    config.addComponent('figure-panel', FigurePanelComponent)
    config.addComponent('footnote', FootnoteComponent)
    config.addComponent('heading', HeadingComponent)
    config.addComponent('inline-formula', InlineFormulaComponent)
    config.addComponent('inline-graphic', GraphicComponent)
    config.addComponent('italic', AnnotationComponent)
    config.addComponent('list', ListComponent)
    config.addComponent('list-item', ListItemComponent)
    config.addComponent('manuscript', ManuscriptComponent)
    config.addComponent('monospace', AnnotationComponent)
    config.addComponent('paragraph', ParagraphComponent)
    config.addComponent('reference-list', ReferenceListComponent)
    config.addComponent('section-label', SectionLabel)
    config.addComponent('subscript', AnnotationComponent)
    config.addComponent('superscript', AnnotationComponent)
    config.addComponent('table', TableComponent)
    config.addComponent('table-figure', TableFigureComponent)
    config.addComponent('unsupported-node', UnsupportedNodeComponent)
    config.addComponent('unsupported-inline-node', UnsupportedInlineNodeComponent)
    config.addComponent('xref', XrefComponent)

    // TODO: we should get rid of this as 'container' is not a concept in Texture anymore
    config.addComponent('container', ContainerNodeComponent)

    // TODO: see which of these we still need
    config.addComponent('affiliations-list', AffiliationsListComponent)
    config.addComponent('editors-list', EditorsListComponent)
    config.addComponent('bio', BioComponent)
    config.addComponent('caption', CaptionComponent)
    config.addComponent('graphic', GraphicComponent)
    config.addComponent('sig-block', SigBlockComponent)

    // TODO: either we use DefaultModelComponent generally, but with better control over the look-and-feel
    // or we use it only in Metadata Editor, or in popups.
    // binding to 'entity' sounds no appropriate anymore, because we do not have the concept of 'Entity' anymore
    config.addComponent('entity', DefaultModelComponent)
    config.addComponent('model-preview', ModelPreviewComponent)

    config.addLabel('abstract-label', 'Abstract')
    config.addLabel('abstract-placeholder', 'Please provide a short description of your article.')
    config.addLabel('authors-label', 'Authors')
    config.addLabel('body-label', 'Main text')
    config.addLabel('body-placeholder', 'Write your article here.')
    config.addLabel('caption-label', 'Caption')
    config.addLabel('footnotes-label', 'Footnotes')
    config.addLabel('label-label', 'Label')
    config.addLabel('references-label', 'References')
    config.addLabel('title-label', 'Title')
    config.addLabel('title-placeholder', 'Enter a title for your article')

    // Used for rendering warning in case of missing images
    config.addIcon('graphic-load-error', { 'fontawesome': 'fa-warning' })
    config.addLabel('graphic-load-error', 'We couldn\'t load an image, sorry.')
  }
}
