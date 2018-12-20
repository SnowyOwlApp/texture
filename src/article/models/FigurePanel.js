import { DocumentNode, CHILD, CHILDREN, STRING, TEXT } from 'substance'
import { RICH_TEXT_ANNOS } from './modelConstants'

export default class FigurePanel extends DocumentNode {}
FigurePanel.schema = {
  type: 'figure-panel',
  content: CHILD('graphic'),
  title: TEXT(...RICH_TEXT_ANNOS, 'xref'),
  label: STRING,
  caption: CHILDREN('p'),
  permission: CHILD('permission')
}
