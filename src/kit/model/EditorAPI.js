import { copySelection } from 'substance'
import AbstractAPI from './AbstractAPI'
import InternalEditingAPI from './InternalEditingAPI'

/*
  EXPERIMENTAL: trying to come up with a unified API for low-level manipulations
  This is very much what we have done so far via Editing.js

  In the way of the former editorSession, this API
  takes all information available from the application state (turle graphics style).

  TODO: I want to use this as part of the low-level API instead of
  the former EditingInterface / Editing hard-wired in Surfaces
*/
export default class EditorAPI extends AbstractAPI {
  constructor (...args) {
    super(...args)

    this._impl = this._createInternalEditorAPI()
  }

  annotate (annotationData) {
    const sel = this._getSelection()
    if (sel && (sel.isPropertySelection() || sel.isContainerSelection())) {
      this._getEditorSession().transaction(tx => {
        this._impl.annotate(tx, annotationData)
      }, { action: 'annotate' })
    }
  }

  break () {
    const sel = this._getSelection()
    if (sel && !sel.isNull()) {
      this._getEditorSession().transaction(tx => {
        this._impl.break(tx)
      }, { action: 'break' })
    }
  }

  copy () {
    const sel = this._getSelection()
    const doc = this._getDocument()
    if (sel && !sel.isNull() && !sel.isCollapsed()) {
      return copySelection(doc, sel)
    }
  }

  cut () {
    const sel = this._getSelection()
    if (sel && !sel.isNull() && !sel.isCollapsed()) {
      let snippet = this.copy()
      this.deleteSelection()
      return snippet
    }
  }

  deleteSelection (options) {
    const sel = this._getSelection()
    if (sel && !sel.isNull() && !sel.isCollapsed()) {
      this._getEditorSession().transaction(tx => {
        this._impl.delete(tx, 'right', options)
      }, { action: 'deleteSelection' })
    }
  }

  deleteCharacter (direction) {
    const sel = this._getSelection()
    if (!sel || sel.isNull()) {
      // nothing
    } else if (!sel.isCollapsed()) {
      this.deleteSelection()
    } else {
      this._getEditorSession().transaction(tx => {
        this._impl.delete(tx, direction)
      }, { action: 'deleteCharacter' })
    }
  }

  insertText (text) {
    const sel = this._getSelection()
    if (sel && !sel.isNull()) {
      this._getEditorSession().transaction(tx => {
        this._impl.insertText(tx, text)
      }, { action: 'insertText' })
    }
  }

  // insert an inline node with given data at the current selection
  insertInlineNode (inlineNode) {
    const sel = this._getSelection()
    if (sel && !sel.isNull() && sel.isPropertySelection()) {
      this._getEditorSession().transaction(tx => {
        return this._impl.insertInlineNode(tx, inlineNode)
      }, { action: 'insertInlineNode' })
    }
  }

  insertBlockNode (blockNode) {
    const sel = this._getSelection()
    if (sel && !sel.isNull()) {
      this._getEditorSession().transaction(tx => {
        return this._impl.insertBlockNode(tx, blockNode)
      }, { action: 'insertBlockNode' })
    }
  }

  paste (content, options) {
    const sel = this._getSelection()
    if (sel && !sel.isNull() && !sel.isCustomSelection()) {
      // TODO: here we need to transform the content
      // so that a paste is compliant with the schema
      this._getEditorSession().transaction(tx => {
        return this._impl.paste(tx, content, options)
      }, { action: 'paste' })
      return true
    }
  }

  switchTextType (nodeData) {
    const sel = this._getSelection()
    if (sel && !sel.isNull()) {
      this._getEditorSession().transaction(tx => {
        return this._impl.switchTextType(tx, nodeData)
      }, { action: 'switchTextType' })
    }
  }

  toggleList (params) {
    const sel = this._getSelection()
    if (sel && !sel.isNull()) {
      this._getEditorSession().transaction(tx => {
        return this._impl.toggleList(tx, params)
      }, { action: 'toggleList' })
    }
  }

  indent () {
    const sel = this._getSelection()
    if (sel && !sel.isNull()) {
      this._getEditorSession().transaction(tx => {
        return this._impl.indent(tx)
      }, { action: 'indent' })
    }
  }

  dedent () {
    const sel = this._getSelection()
    if (sel && !sel.isNull()) {
      this._getEditorSession().transaction(tx => {
        return this._impl.dedent(tx)
      }, { action: 'dedent' })
    }
  }

  _getSelection () {
    throw new Error('This method is abstract')
  }

  _getDocument () {
    throw new Error('This method is abstract')
  }

  _getEditorSession () {
    throw new Error('This method is abstract')
  }

  _createInternalEditorAPI () {
    return new InternalEditingAPI()
  }
}
