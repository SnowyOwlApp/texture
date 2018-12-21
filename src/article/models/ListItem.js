import { DocumentNode, TextNodeMixin, TEXT } from 'substance'

export default class ListItem extends TextNodeMixin(DocumentNode) {
  getLevel () {
    return this.level
  }

  setLevel (newLevel) {
    let doc = this.getDocument()
    doc.set([this.id, 'level'], newLevel)
  }

  getPath () {
    return [this.id, 'content']
  }

  static isListItem () {
    return true
  }
}

ListItem.schema = {
  type: 'list-item',
  level: 'number',
  content: TEXT()
}
