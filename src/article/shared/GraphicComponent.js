import { NodeComponent } from '../../kit'

export default class GraphicComponent extends NodeComponent {
  render ($$) {
    const node = this.props.node
    const mode = node.type === 'inline-graphic' ? 'inline' : 'block'
    let url = node.getAttribute('xlink:href')
    let urlResolver = this.context.urlResolver
    if (urlResolver) {
      url = urlResolver.resolveUrl(url)
    }
    let elClass = mode === 'inline' ? 'sc-inline-graphic' : 'sc-graphic'
    let tagName = mode === 'inline' ? 'span' : 'div'

    let el = $$(tagName).addClass(elClass)
      .attr('data-id', node.id)

    if (this.state.errored) {
      let errorEl = $$(tagName).addClass('se-error').append(
        this.context.iconProvider.renderIcon($$, 'graphic-load-error').addClass('se-icon')
      )

      if (mode === 'block') {
        errorEl.append(
          this.getLabel('graphic-load-error')
        )
      } else {
        errorEl.attr('title', this.getLabel('graphic-load-error'))
      }

      el.append(errorEl)
    } else {
      el.append(
        $$('img').attr({src: url}).ref('image')
          .on('error', this._onLoadError)
      )
    }

    return el
  }

  _onLoadError () {
    this.extendState({errored: true})
  }
}
