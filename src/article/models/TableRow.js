import { DocumentNode, CHILDREN, documentHelpers } from 'substance'

export default class TableRow extends DocumentNode {
  getCells () {
    return documentHelpers.getNodes(this.getDocument(), this.cells)
  }
}
TableRow.schema = {
  type: 'table-row',
  cells: CHILDREN('table-cell')
}
