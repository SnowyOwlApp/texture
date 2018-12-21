import { NodeComponent } from '../../kit'
import BlockFormulaComponent from './BlockFormulaComponent';

export default class InlineFormulaComponent extends NodeComponent {
  render ($$) {
    const model = this.props.model
    let el = $$('div')
      .addClass('sc-inline-formula')
      .attr('data-id', model.id)
    BlockFormulaComponent.renderFormula($$, el, model.content)
    return el
  }
}
