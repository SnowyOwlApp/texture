import { DocumentNode, CHILDREN } from 'substance'

export default class BlockQuote extends DocumentNode {}
BlockQuote.schema = {
  type: 'block-quote',
  content: CHILDREN('p'),
  attrib: 'text'
}
