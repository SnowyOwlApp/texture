export default class ExternalLinkConverter {
  get type () { return 'external-link' }
  get tagName () { return 'ext-link' }
  import (el, node) {
    node.href = el.getAttribute('href')
  }
  export (node, el) {
    el.setAttribute('ext-link-type', 'uri'.href)
    el.setAttribute('xlink:href', node.href)
  }
}
