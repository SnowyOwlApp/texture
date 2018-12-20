import { DocumentNode, CHILDREN } from 'substance'

export default class Figure extends DocumentNode {
  _initialize (...args) {
    super._initialize(...args)

    this.state = {
      currentPanelIndex: 0
    }
  }
}
Figure.schema = {
  type: 'figure',
  panels: CHILDREN('figure-panel')
}
