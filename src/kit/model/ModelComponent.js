import { Component } from 'substance'
import addModelObserver from './addModelObserver'
import removeModelObserver from './removeModelObserver'
import getComponentForModel from './getComponentForModel'

export default class ModelComponent extends Component {
  didMount () {
    addModelObserver(this.props.model, this.rerender, this)
  }

  dispose () {
    removeModelObserver(this)
  }

  getComponentForModel (model) {
    return getComponentForModel(this.context, model)
  }
}
