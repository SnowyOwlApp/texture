import DefaultModelComponent from '../shared/DefaultModelComponent'
import LanguageEditor from './LanguageEditor'

export default class TranslatableEntryEditor extends DefaultModelComponent {
  // using a special translatable property editor for entries with language picker
  _getPropertyEditorClass (property) {
    let propertyName = property.name
    if (propertyName === 'language') {
      return LanguageEditor
    } else {
      return super._getPropertyEditorClass(property)
    }
  }
}
