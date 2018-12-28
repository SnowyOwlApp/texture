import DefaultModelComponent from './DefaultModelComponent'
import LicenseEditor from './LicenseEditor'
import { getLabel } from './nodeHelpers'

export default class FigureMetadataComponent extends DefaultModelComponent {
  _getClassNames () {
    return `sc-figure-metadata`
  }

  _renderHeader ($$) {
    const model = this.props.model
    let header = $$('div').addClass('se-header')
    header.append(
      $$('div').addClass('se-label').text(getLabel(model))
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
    // ATTENTION: we want to show permission properties like they were fields of the panel
    if (!this._properties) {
      // TODO: provide a helper that creates a flattened property map
      let properties = new Map()
      for (let [name, model] of this.props.model.getProperties()) {
        // flatten permission
        if (name === 'permission') {
          for (let [_name, _model] of model) {
            properties.set(_name, _model)
          }
        } else {
          properties.set(name, model)
        }
      }
      this._properties = properties
    }
    return this._properties
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
