import { DocumentNode, CHILD, CHILDREN, TEXT } from 'substance'
import { RICH_TEXT_ANNOS } from './modelConstants'

export default class Article extends DocumentNode {}
Article.schema = {
  type: 'article',
  metadata: CHILD('metadata'),
  title: TEXT(RICH_TEXT_ANNOS),
  abstract: CHILD('abstract'),
  body: CHILD('body'),
  references: CHILDREN('reference'),
  footnotes: CHILDREN('footnote')
}
