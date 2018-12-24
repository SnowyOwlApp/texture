export default {
  type: 'strike-through',
  tagName: 'span',
  matchElement (el) {
    return el.getStyle('text-decoration') === 'line-through'
  },
  export (node, el) {
    el.setStyle('text-decoration', 'line-through')
  }
}
