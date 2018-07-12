import { keys } from 'substance'
import {
  TextureConfigurator, ArticlePackage,
  TextureEditorSession, EditorState, TextureDocument,
  TableComponent, tableHelpers, TableEditing
} from '../index'
import { testAsync, getMountPoint } from './testHelpers'

testAsync('TableComponent: mounting a table component', async (t) => {
  let { table, context } = _setup(t)
  let el = getMountPoint(t)
  let comp = new TableComponent(null, { node: table }, { context })
  comp.mount(el)
  t.notNil(el.find('.sc-table'), 'there should be a rendered table element')
  t.end()
})

testAsync('TableComponent: setting table selections', async (t) => {
  let { editorSession, table, context } = _setup(t)
  let el = getMountPoint(t)
  let comp = new TableComponent(null, { node: table }, { context })
  comp.mount(el)
  let matrix = table.getCellMatrix()
  let firstCell = matrix[0][0]
  let tableEditing = new TableEditing(editorSession, table.id, comp.getSurfaceId())
  // setting the selection on the first cell
  let sel = tableEditing.createTableSelection({
    anchorCellId: firstCell.id,
    focusCellId: firstCell.id
  })
  editorSession.setSelection(sel)
  t.equal(comp.refs.selAnchor.el.css('visibility'), 'visible', 'the selection overlay for the selection anchor should be visible')
  t.equal(comp.refs.selRange.el.css('visibility'), 'visible', 'the selection overlay for the selection range should be visible')

  // setting the selection inside the first cell
  editorSession.setSelection({
    type: 'property',
    path: firstCell.getPath(),
    startOffset: 0,
    endOffset: 0
  })
  t.equal(comp.refs.selAnchor.el.css('visibility'), 'visible', 'the selection overlay for the selection anchor should be visible')
  t.equal(comp.refs.selRange.el.css('visibility'), 'hidden', 'the selection overlay for the selection range should be hidden')

  // nulling the selection
  editorSession.setSelection(null)
  t.equal(comp.refs.selAnchor.el.css('visibility'), 'hidden', 'the selection overlay for the selection anchor should be hidden')
  t.equal(comp.refs.selRange.el.css('visibility'), 'hidden', 'the selection overlay for the selection range should be hidden')

  t.end()
})

testAsync('TableComponent: mouse interactions', async (t) => {
  let { editorSession, table, context } = _setup(t)
  let el = getMountPoint(t)
  let comp = new TableComponent(null, { node: table }, { context })
  comp.mount(el)
  let matrix = table.getCellMatrix()
  let firstCell = matrix[0][0]
  let firstCellComp = comp.refs[firstCell.id]
  let secondCell = matrix[0][1]
  let secondCellComp = comp.refs[secondCell.id]

  // simulate a mouse down on the first cell
  comp._onMousedown(new DOMEvent({ target: firstCellComp.el }))
  let sel = editorSession.getSelection()
  t.equal(sel.customType, 'table', 'The table should be selected,')
  t.equal(sel.data.anchorCellId, firstCell.id, '.. with anchor on first cell,')
  t.equal(sel.data.focusCellId, firstCell.id, '.. and focus on first cell,')

  // simulate a right mouse down on the second cell
  comp._onMousedown(new DOMEvent({ target: secondCellComp.el, which: 3 }))
  sel = editorSession.getSelection()
  t.equal(sel.customType, 'table', 'The table should be selected,')
  t.equal(sel.data.anchorCellId, secondCell.id, '.. with anchor on second cell,')
  t.equal(sel.data.focusCellId, secondCell.id, '.. and focus on second cell,')

  t.end()
})

testAsync('TableComponent: keyboard interactions', async (t) => {
  let { editorSession, table, context } = _setup(t)
  let el = getMountPoint(t)
  let comp = new TableComponent(null, { node: table }, { context })
  comp.mount(el)
  let matrix = table.getCellMatrix()
  let cellB1 = matrix[0][1]
  let cellA2 = matrix[1][0]
  let cellB2 = matrix[1][1]
  let cellB2Comp = comp.refs[cellB2.id]
  let sel

  // simulate a mouse down on the first cell
  comp._onMousedown(new DOMEvent({ target: cellB2Comp.el }))

  // simulate LEFT key
  comp._onKeydown(new DOMEvent({ keyCode: keys.LEFT }))
  sel = editorSession.getSelection()
  t.equal(sel.customType, 'table', 'The table should be selected,')
  t.equal(sel.data.anchorCellId, cellA2.id, '.. with anchor on A2,')
  t.equal(sel.data.focusCellId, cellA2.id, '.. and focus on A2,')

  // simulate RIGHT key
  comp._onKeydown(new DOMEvent({ keyCode: keys.RIGHT }))
  sel = editorSession.getSelection()
  t.equal(sel.customType, 'table', 'The table should be selected,')
  t.equal(sel.data.anchorCellId, cellB2.id, '.. with anchor on B2,')
  t.equal(sel.data.focusCellId, cellB2.id, '.. and focus on B2,')

  // simulate UP key
  comp._onKeydown(new DOMEvent({ keyCode: keys.UP }))
  sel = editorSession.getSelection()
  t.equal(sel.customType, 'table', 'The table should be selected,')
  t.equal(sel.data.anchorCellId, cellB1.id, '.. with anchor on B1,')
  t.equal(sel.data.focusCellId, cellB1.id, '.. and focus on B1,')

  // simulate DOWN key
  comp._onKeydown(new DOMEvent({ keyCode: keys.DOWN }))
  sel = editorSession.getSelection()
  t.equal(sel.customType, 'table', 'The table should be selected,')
  t.equal(sel.data.anchorCellId, cellB2.id, '.. with anchor on B2,')
  t.equal(sel.data.focusCellId, cellB2.id, '.. and focus on B2,')

  t.end()
})

function _setup (t) {
  let configurator = new TextureConfigurator()
  configurator.import(ArticlePackage)
  // TODO: this could be a little easier
  let config = configurator.getConfiguration('article').getConfiguration('manuscript')
  let doc = _createEmptyTextureArticle(config)
  let table = tableHelpers.generateTable(doc, 10, 5)
  doc.find('body').append(table)
  // TODO: look closely here: this is the footprint of how context
  // is used by TableComponent and children
  let editorState = new EditorState(doc)
  let editorSession = new TextureEditorSession(editorState, config)
  let componentRegistry = config.getComponentRegistry()
  let commandGroups = config.getCommandGroups()
  let iconProvider = config.getIconProvider()
  let labelProvider = config.getLabelProvider()
  let keyboardShortcuts = config.getKeyboardShortcuts()
  let tools = config.getTools()
  let context = {
    editorSession,
    configurator: config,
    componentRegistry,
    commandGroups,
    tools,
    iconProvider,
    labelProvider,
    keyboardShortcuts
  }
  return { context, editorSession, doc, table }
}

function _createEmptyTextureArticle (configurator) {
  let doc = new TextureDocument(configurator.getSchema())
  doc.$$ = doc.createElement.bind(doc)
  const $$ = doc.$$
  $$('article', { id: 'article' }).append(
    $$('front').append(
      $$('article-meta').append(
        $$('title-group').append(
          $$('article-title')
        ),
        $$('abstract')
      )
    ),
    $$('body'),
    $$('back')
  )
  return doc
}

class DOMEvent {
  constructor (props) {
    Object.assign(this, props)
  }
  stopPropagation () {}
  preventDefault () {}
}
