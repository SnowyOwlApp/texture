import { TextNode, TEXT } from 'substance'

export default class Heading extends TextNode {}
Heading.schema = {
  type: 'heading',
  level: 'number',
  content: TEXT()
}
