import { FontAwesomeIcon } from 'substance'
import {
  FormRowComponent, ValueComponent, StringComponent
} from '../../kit'

export default class InplaceRefContribEditor extends ValueComponent {
  render ($$) {
    let el = $$('div').addClass('sc-inplace-ref-contrib-editor')
    el.append(this._renderRefContribs($$))
    el.append(
      $$('button').addClass('se-add-value')
        // TODO: use icon provider
        .append(
          $$(FontAwesomeIcon, {icon: 'fa-plus'}).addClass('se-icon')
        )
        .on('click', this._addContrib)
    )
    return el
  }

  _renderRefContribs ($$) {
    const model = this.props.model
    let items = model.getItems()
    return items.map(item => this._renderRefContrib($$, item))
  }

  _renderRefContrib ($$, refContrib) {
    let id = refContrib.id
    return $$(FormRowComponent).attr('data-id', id).addClass('sm-ref-contrib').append(
      // TODO: it would be good to have a default factory for property editors
      $$(StringComponent, {
        label: this.getLabel('name'),
        model: refContrib.getNameModel()
      }).addClass('sm-name'),
      $$(StringComponent, {
        label: this.getLabel('given-names'),
        model: refContrib.getGivenNamesModel()
      }).addClass('sm-given-names'),
      // TODO: use icon provider
      $$('button').addClass('se-remove-value')
        .append($$(FontAwesomeIcon, {icon: 'fa-trash'}))
        .on('click', this._removeContrib.bind(this, refContrib))
    ).ref(id)
  }

  _addContrib () {
    const model = this.props.model
    model.addItem({type: 'ref-contrib'})
  }

  _removeContrib (contrib) {
    const model = this.props.model
    model.removeItem(contrib)
  }
}
