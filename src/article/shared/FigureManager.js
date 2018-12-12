import CitableContentManager from './CitableContentManager'
import FigureLabelGenerator from './FigureLabelGenerator'

export default class FigureManager extends CitableContentManager {
  constructor (documentSession, config) {
    super(documentSession, 'fig', ['figure', 'figure-panel'], new FigureLabelGenerator(config))
    this._updateLabels('initial')
  }

  _getItemSelector () {
    return 'figure-panel'
  }

  _computeTargetUpdates () {
    let figures = this._getContentElement().findAll('figure')
    let records = {}
    // Iterate through all figures and their panels
    // and generate a record for every item that should be updated
    // leave any information necessary to control the label generator
    let figureCounter = 1
    for (let figure of figures) {
      let id = figure.id
      let pos = [{ pos: figureCounter }]
      let label = this.labelGenerator.getSingleLabel(pos)
      records[id] = { id, pos, label }
      // ATTENTION: ATM we do not support any special label generation, such as Figure 1-figure supplement 2, which is controlled via attributes (@specific-use)
      // TODO: to support eLife's 'Figure Supplement' labeling scheme we would use a different counter and some type of encoding
      // e.g. [1, { pos: 1, type: 'supplement' }], we would then
      let panels = figure.getPanels()
      let panelCounter = 1
      // processing sub-figures
      if (panels.length > 1) {
        for (let panel of panels) {
          let id = panel.id
          let pos = [{ pos: figureCounter }, { pos: panelCounter, type: 'default' }]
          let label = this.labelGenerator.getSingleLabel(pos)
          records[id] = { id, pos, label }
          panelCounter++
        }
      // edge-case: figure-groups with just a single panel get a simple label
      } else {
        let panel = panels[0]
        let id = panel.id
        let pos = [{ pos: figureCounter }]
        let label = this.labelGenerator.getSingleLabel(pos)
        records[id] = { id, pos, label }
      }
      figureCounter++
    }
    return records
  }
}
