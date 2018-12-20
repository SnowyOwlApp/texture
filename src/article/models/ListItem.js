import { DocumentNode, TEXT } from 'substance'

export default class ListItem extends DocumentNode {
  getLevel () {
    return this.level
  }

  setLevel (newLevel) {
    let doc = this.getDocument()
    doc.set([this.id, 'level'], newLevel)
  }

  static isListItem () {
    return true
  }
}

ListItem.schema = {
  type: 'list-item',
  content: TEXT(),
  level: 'integer'
}
