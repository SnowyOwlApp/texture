import { Component } from 'substance'
import { PREVIEW_MODE } from '../ArticleConstants'
import PreviewComponent from './PreviewComponent'
import katex from 'katex'

export default class BlockFormulaComponent extends Component {
  render ($$) {
    const mode = this.props.mode
    const model = this.props.model
    const label = model.label || '?'
    const source = model.content

    if (mode === PREVIEW_MODE) {
      return $$(PreviewComponent, {
        id: model.id,
        label,
        description: $$('div').html(katex.renderToString(source))
      })
    }

    let el = $$('div')
      .addClass('sc-disp-formula')
      .attr('data-id', model.id)

    BlockFormulaComponent.renderFormula($$, el, source)

    el.append(
      $$('div').addClass('se-label').append(label)
    )

    return el
  }

  static renderFormula ($$, el, source) {
    if (!source) {
      el.append('?')
    } else {
      try {
        el.append(
          $$('span').addClass('se-formula').html(katex.renderToString(source))
        )
        el.append($$('div').addClass('se-blocker'))
      } catch (error) {
        el.addClass('sm-error')
          .text(error.message)
      }
    }
  }
}
