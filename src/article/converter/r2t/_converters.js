import BodyConverter from './BodyConverter'
import BlockFormulaConverter from './BlockFormulaConverter'
import BlockQuoteConverter from './BlockQuoteConverter'
import FigureConverter from './FigureConverter'
import FigurePanelConverter from './FigurePanelConverter'
import FootnoteConverter from './FootnoteConverter'
import ElementCitationConverter from './ElementCitationConverter'
import ListConverter from './ListConverter'
import PermissionsConverter from './PermissionsConverter'
import PreformatConverter from './PreformatConverter'
import TableConverter from './TableConverter'
import TableFigureConverter from './TableFigureConverter'
import UnsupportedNodeConverter from './UnsupportedNodeConverter'
import UnsupportedInlineNodeConverter from './UnsupportedInlineNodeConverter'
import XrefConverter from './XrefConverter'

export default [
  new BodyConverter(),
  new BlockFormulaConverter(),
  new BlockQuoteConverter(),
  new FigureConverter(),
  new FigurePanelConverter(),
  new FootnoteConverter(),
  new ElementCitationConverter(),
  new ListConverter(),
  new PermissionsConverter(),
  new PreformatConverter(),
  new TableConverter(),
  new TableFigureConverter(),
  UnsupportedNodeConverter,
  UnsupportedInlineNodeConverter,
  new XrefConverter()
]
