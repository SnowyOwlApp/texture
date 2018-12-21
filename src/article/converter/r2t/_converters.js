import BodyConverter from './BodyConverter'
import BoldConverter from './BoldConverter'
import BlockFormulaConverter from './BlockFormulaConverter'
import BlockQuoteConverter from './BlockQuoteConverter'
import FigureConverter from './FigureConverter'
import FigurePanelConverter from './FigurePanelConverter'
import FootnoteConverter from './FootnoteConverter'
import ElementCitationConverter from './ElementCitationConverter'
import ExternalLinkConverter from './ExternalLinkConverter'
import ItalicConverter from './ItalicConverter'
import MonospaceConverter from './MonospaceConverter'
import ListConverter from './ListConverter'
import ParagraphConverter from './ParagraphConverter'
import PermissionsConverter from './PermissionsConverter'
import PreformatConverter from './PreformatConverter'
import SubscriptConverter from './SubscriptConverter'
import SuperscriptConverter from './SuperscriptConverter'
import TableConverter from './TableConverter'
import TableFigureConverter from './TableFigureConverter'
import UnsupportedNodeConverter from './UnsupportedNodeConverter'
import UnsupportedInlineNodeConverter from './UnsupportedInlineNodeConverter'
import XrefConverter from './XrefConverter'

export default [
  new BodyConverter(),
  new BoldConverter(),
  new BlockFormulaConverter(),
  new BlockQuoteConverter(),
  new ExternalLinkConverter(),
  new FigureConverter(),
  new FigurePanelConverter(),
  new FootnoteConverter(),
  new ElementCitationConverter(),
  new ItalicConverter(),
  new MonospaceConverter(),
  new ListConverter(),
  new ParagraphConverter(),
  new PermissionsConverter(),
  new PreformatConverter(),
  new SubscriptConverter(),
  new SuperscriptConverter(),
  new TableConverter(),
  new TableFigureConverter(),
  UnsupportedNodeConverter,
  UnsupportedInlineNodeConverter,
  new XrefConverter()
]
