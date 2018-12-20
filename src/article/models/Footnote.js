import { DocumentNode, CHILDREN, PLAIN_TEXT } from 'substance'

export default class Footnote extends DocumentNode {
  set label (val) {
    // TODO: at some point we have to distinguish generated from custom labels
    // for custom labels we need to track ops, for generated labels not.
    this._set('label', val)
  }
}
Footnote.schema = {
  type: 'fn',
  label: PLAIN_TEXT,
  content: CHILDREN('paragraph')
}
