import { FontAwesomeIcon, Component } from 'substance'
import { FormRowComponent } from '../../kit'
import { CARD_MINIMUM_FIELDS } from '../ArticleConstants'

/**
 * A component that renders a model in a generic way iterating all properties.
 */
export default class DefaultModelComponent extends Component {
  didMount () {
    // EXPERIMENTAL: ExperimentalArticleValidator updates `node.id, @issues`
    const model = this.props.model
    this.context.appState.addObserver(['document'], this._rerenderWhenIssueHaveChanged, this, {
      stage: 'render',
      document: {
        path: [model.id, '@issues']
      }
    })
  }

  dispose () {
    this.context.appState.removeObserver(this)
  }

  getInitialState () {
    return {
      fullMode: false
    }
  }

  render ($$) {
    const fullMode = this.state.fullMode
    const model = this.props.model
    // TODO: issues should be accessed via model, not directly
    const nodeIssues = model._node['@issues']
    let hasIssues = (nodeIssues && nodeIssues.size > 0)
    const el = $$('div').addClass(this._getClassNames()).attr('data-id', model.id)
    // EXPERIMENTAL: highlighting fields with issues
    if (hasIssues) {
      el.addClass('sm-warning')
    }
    el.append(this._renderHeader($$))

    // TODO: this needs to be redesigned:
    // 1. it should be configurable which properties are optional
    // 2. the determination of hidden vs shown props should be extracted into a helper method
    let hasHiddenProps = false
    const properties = this._getProperties()
    const propsLength = properties.size
    const hiddenPropsLength = Array.from(properties.keys()).reduce((total, key) => {
      let property = properties.get(key)
      // FIXME: hide properties that are not required
      if (property.isEmpty()) {
        total++
      }
      return total
    }, 0)
    const exposedPropsLength = propsLength - hiddenPropsLength
    let fieldsLeft = CARD_MINIMUM_FIELDS - exposedPropsLength

    for (let [name, model] of properties) {
      // FIXME: hide properties that are not required
      let hidden = model.isEmpty()
      if (hidden && fieldsLeft > 0) {
        hidden = false
        fieldsLeft--
      }
      if (hidden) hasHiddenProps = true
      if (fullMode || !hidden) {
        const PropertyEditor = this._getPropertyEditorClass(model, name)
        // skip this property if the editor implementation produces nil
        if (!PropertyEditor) continue
        let label
        if (this._showLabelForProperty(name)) {
          label = this.getLabel(name)
        }
        const issues = nodeIssues ? nodeIssues.get(name) : []
        el.append(
          $$(FormRowComponent, {
            label,
            issues
          }).addClass(`sm-${name}`).append(
            $$(PropertyEditor, {
              label,
              model
            }).ref(name)
          )
        )
      }
    }
    const controlEl = $$('div').addClass('se-control')
      .on('click', this._toggleMode)

    if (hasHiddenProps) {
      if (fullMode) {
        controlEl.append(
          $$(FontAwesomeIcon, { icon: 'fa-chevron-up' }).addClass('se-icon'),
          this.getLabel('show-less-fields')
        )
      } else {
        controlEl.append(
          $$(FontAwesomeIcon, { icon: 'fa-chevron-down' }).addClass('se-icon'),
          this.getLabel('show-more-fields')
        )
      }
    }

    const footer = $$('div').addClass('se-footer').append(
      controlEl
    )

    el.append(footer)

    return el
  }

  _getProperties () {
    return this.props.model.getProperties()
  }

  _getClassNames () {
    return `sc-default-model sm-${this.props.model.type}`
  }

  _renderHeader ($$) {
    // TODO: rethink this. IMO it is not possible to generalize this implementation.
    // Maybe it is better to just use the regular component and pass a prop to allow the component to render in a 'short' style
    const ModelPreviewComponent = this.getComponent('model-preview', true)
    const model = this.props.model
    let header = $$('div').addClass('se-header')
    if (ModelPreviewComponent) {
      header.append(
        $$(ModelPreviewComponent, { model })
      )
    }
    return header
  }

  /*
    Can be overriden to specify for which properties, labels should be hidden.
  */
  _showLabelForProperty (prop) {
    return true
  }

  // TODO: get rid of this
  get isRemovable () {
    return true
  }

  _getPropertyEditorClass (property) {
    return this.getComponent(property.type)
  }

  _toggleMode () {
    const fullMode = this.state.fullMode
    this.extendState({fullMode: !fullMode})
  }

  _rerenderWhenIssueHaveChanged () {
    // console.log('Rerendering NodeModelCompent after issues have changed', this.props.model.id)
    this.rerender()
  }
}
