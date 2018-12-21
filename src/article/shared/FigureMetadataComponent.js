import DefaultModelComponent from './DefaultModelComponent'
import LicenseEditor from './LicenseEditor'

export default class FigureMetadataComponent extends DefaultModelComponent {
  _getClassNames () {
    return `sc-figure-metadata`
  }

  _renderHeader ($$) {
    const model = this.props.model
    let header = $$('div').addClass('se-header')
    header.append(
      $$('div').addClass('se-label').text(model.getLabel())
    )
    return header
  }

  // overriding this to get spawn a special editor for the content
  _getPropertyEditorClass (property) {
    // skip 'label' here, as it is shown 'read-only' in the header instead
    if (property.name === 'label') {
      return null
    // special editor to pick license type
    } else if (property.name === 'license') {
      return LicenseEditor
    } else {
      return super._getPropertyEditorClass(property)
    }
  }

  _getProperties () {
    let model = this.props.model
    let permission = model.getPermission()
    let properties = model.getProperties()
    properties = properties.filter(p => p.name !== 'permission')
    properties = properties.concat(permission.getProperties())
    return properties
  }

  _showLabelForProperty (prop) {
    // Don't render a label for content property to use up the full width
    if (prop === 'content') {
      return false
    }
    return true
  }

  get isRemovable () {
    return false
  }
}
