import { documentHelpers } from 'substance'
import AbstractCitationManager from './AbstractCitationManager'
import NumberedLabelGenerator from './NumberedLabelGenerator'

export default class ReferenceManager extends AbstractCitationManager {
  constructor (documentSession, config) {
    super(documentSession, 'bibr', ['reference'], new NumberedLabelGenerator(config))
    // compute initial labels
    this._updateLabels('initial')
  }

  getBibliography () {
    return this.getSortedCitables()
  }

  hasCitables () {
    let refIds = this._getRefIds()
    return refIds.length > 0
  }

  getCitables () {
    return documentHelpers.getNodesForIds(this._getDocument(), this._getRefIds())
  }

  _getRefIds () {
    let doc = this._getDocument()
    let article = doc.get('article')
    return article.references
  }
}
