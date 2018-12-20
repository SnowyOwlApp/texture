
import { XMLExporter } from 'substance'
import converters from './_converters'

/**
 * A factory the creates an exporter instance that can be used to convert a full document to JATS
 * but also for converting single nodes.
 *
 * @param {DOMElement} jatsDom
 * @param {InternalArticleDocument} doc
 */
export default function createJatsExporter (jatsDom, doc) {
  // ATTENTION: in this case it is different to the importer
  // not the first matching converter is used, but the last one which is
  // registered for a specific nody type, i.e. a later converter overrides a previous one
  let exporter = new Internal2JATSExporter({
    converters,
    elementFactory: {
      createElement: jatsDom.createElement.bind(jatsDom)
    }
  })
  exporter.state.doc = doc
  return exporter
}

class Internal2JATSExporter extends XMLExporter {
  getNodeConverter (node) {
    let type = node.type
    if (node.isInstanceOf('bibr')) {
      type = 'bibr'
    }
    return this.converters.get(type)
  }
}
