import { DocumentNode, CHILDREN } from 'substance'

export default class BlockQuote extends DocumentNode {}
BlockQuote.schema = {
  type: 'block-quote',
  attrib: 'text',
  content: CHILDREN('p')
}
