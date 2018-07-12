import { Command } from 'substance'

export default class SwitchViewCommand extends Command {
  getCommandState (params, context) {
    let state = context.state
    let view = state.view
    let active = (view === this.config.view)
    let commandState = {
      disabled: false,
      active
    }
    return commandState
  }

  execute (params, context) {
    let state = context.state
    state.view = this.config.view
    state.propagate()
  }
}
