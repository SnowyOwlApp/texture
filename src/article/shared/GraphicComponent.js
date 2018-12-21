import { ModelComponent } from '../../kit'

export default class GraphicComponent extends ModelComponent {
  render ($$) {
    const model = this.props.model
    const urlResolver = this.context.urlResolver
    let url = model.href
    if (urlResolver) {
      url = urlResolver.resolveUrl(url)
    }

    let el = $$(this.tagName).addClass(this._getClassNames())
      .attr('data-id', model.id)
    if (this.state.errored) {
      let errorEl = $$(this.tagName).addClass('se-error').append(
        this.context.iconProvider.renderIcon($$, 'graphic-load-error').addClass('se-icon')
      )
      this._renderError($$, errorEl)
      el.append(errorEl)
    } else {
      el.append(
        $$('img').attr({src: url}).ref('image')
          .on('error', this._onLoadError)
      )
    }
    return el
  }

  _renderError ($$, errorEl) {
    errorEl.append(
      this.getLabel('graphic-load-error')
    )
  }

  _getClassNames () {
    return 'sc-graphic'
  }

  get tagName () {
    return 'div'
  }

  _onLoadError () {
    this.extendState({errored: true})
  }
}
