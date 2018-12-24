import { DocumentNode, ContainerMixin, CHILDREN, PLAIN_TEXT } from 'substance'

export default class Footnote extends ContainerMixin(DocumentNode) {
  getContent () {
    return this.content
  }
  getContentPath () {
    return [this.id, 'content']
  }
  set label (val) {
    // TODO: at some point we have to distinguish generated from custom labels
    // for custom labels we need to track ops, for generated labels not.
    this._set('label', val)
  }
}
Footnote.schema = {
  type: 'footnote',
  label: PLAIN_TEXT,
  content: CHILDREN('paragraph')
}
