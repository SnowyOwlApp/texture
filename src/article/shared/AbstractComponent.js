import ContentComponent from './ContentComponent'

export default class AbstractComponent extends ContentComponent {
  _getClassNames () {
    return 'sc-abstract'
  }
}
