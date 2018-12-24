import { TextNode, TEXT } from 'substance'

export default class Paragraph extends TextNode {}
Paragraph.schema = {
  type: 'paragraph',
  content: TEXT('bold', 'external-link', 'inline-formula', 'inline-graphic', 'italic', 'monospace', 'subscript', 'superscript')
}
