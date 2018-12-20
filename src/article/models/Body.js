import { DocumentNode } from 'substance'

export default class Body extends DocumentNode {}
Body.schema = {
  type: 'body',
  content: {
    type: ['array', 'id'],
    owned: true,
    default: [],
    targetTypes: ['block-formula', 'block-quote', 'figure', 'heading', 'paragraph', 'table-figure'],
    defaultTextType: 'paragraph'
  }
}
