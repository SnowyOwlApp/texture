import FigurePanel from './FigurePanel'
import { CHILD, CHILDREN } from 'substance'

export default class TableFigure extends FigurePanel {
  // HACK: we need a place to store the tableFootnoteManager
  // in a controlled fashion
  getFootnoteManager () {
    return this._tableFootnoteManager
  }
  setFootnoteManager (footnoteManager) {
    this._tableFootnoteManager = footnoteManager
  }
  hasFootnotes () {
    return this.footnotes && this.footnotes.length > 0
  }
}
TableFigure.schema = {
  type: 'table-figure',
  content: CHILD('table'),
  footnotes: CHILDREN('fn')
}
