export default class GraphicConverter {
  get type () { return 'graphic' }

  get tagName () { return 'graphic' }

  import (el, node) {
    node.href = el.attr('xlink:href')
  }

  export (node, el) {
    el.attr('xlink:href', node.href)
  }
}
