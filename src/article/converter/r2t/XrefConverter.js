import { getLabel } from '../../shared/nodeHelpers'

export default class XrefConverter {
  get type () { return 'xref' }

  get tagName () { return 'xref' }

  import (el, node) {
    node.refType = el.attr('ref-type')
    node.refTargets = (el.attr('rid') || '').split(/\s/)
  }

  export (node, el, exporter) {
    el.attr(node.attributes)
    let label = getLabel(node)
    if (label) {
      el.text(label)
    }
  }
}
