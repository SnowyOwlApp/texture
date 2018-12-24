import { TextNode, TEXT } from 'substance'

export default class TableCell extends TextNode {
  constructor (...args) {
    super(...args)

    this.rowIdx = -1
    this.colIdx = -1
  }

  isShadowed () {
    return this.shadowed
  }

  getMasterCell () {
    return this.masterCell
  }
}

TableCell.schema = {
  type: 'table-cell',
  content: TEXT('bold', 'italic', 'superscript', 'subscript', 'monospace', 'external-link', 'xref', 'inline-formula', 'inline-graphic')
}
