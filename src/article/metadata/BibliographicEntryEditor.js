import DefaultModelComponent from '../shared/DefaultModelComponent'
import InplaceRefContribEditor from './InplaceRefContribEditor'

export default class BibliographicEntryEditor extends DefaultModelComponent {
  // using a special inplace property editor for 'ref-contrib's
  _getPropertyEditorClass (property) {
    let targetTypes = property.targetTypes
    if (targetTypes[0] === 'ref-contrib') {
      return InplaceRefContribEditor
    } else {
      return super._getPropertyEditorClass(property)
    }
  }
}
