/**
 * This extension adds some specifc API for maintaining panels.
 * Particularly, it makes sure that the node state is updated propertly.
 */
export default function (GeneratedModel) {
  return class FigureModel extends GeneratedModel {
    getCurrentPanelIndex () {
      return this._node.getCurrentPanelIndex()
    }

    // TODO: use a record with property names here instead of an obscure 'file'
    addPanel (file) {
      let panelsCollection = this.getPanelsModel()
      const currentPos = this.getCurrentPanelIndex()
      // TODO: discuss what makes more sense
      // insert before the current, or insert after the current panel
      const newPos = currentPos + 1
      return panelsCollection.insertItemAt(newPos, file, tx => {
        tx.set([this.id, 'state', 'currentPanelIndex'], newPos)
      })
    }

    removePanel () {
      let panelsCollection = this.getPanelsModel()
      const L = panelsCollection.length
      const pos = this.getCurrentPanelIndex()
      let newPos = Math.max(0, Math.min(pos, L - 2))
      panelsCollection.removeAt(pos, tx => {
        if (newPos !== pos) {
          tx.set([this.id, 'state', 'currentPanelIndex'], pos - 1)
        }
      })
    }

    movePanelDown () {
      this._movePanel(+1)
    }

    movePanelUp () {
      this._movePanel(-1)
    }

    _movePanel (shift) {
      let panelsCollection = this.getPanelsModel()
      const L = panelsCollection.length
      const pos = this.getCurrentPanelIndex()
      const currentPanel = panelsCollection.getItemAt(this.getCurrentPanelIndex())
      panelsCollection.moveItem(currentPanel, shift, tx => {
        const newPos = Math.min(L - 1, Math.max(0, pos + shift))
        tx.set([this.id, 'state', 'currentPanelIndex'], newPos)
      })
    }
  }
}
