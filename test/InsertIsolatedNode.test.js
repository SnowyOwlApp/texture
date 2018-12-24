import { test } from 'substance-test'
import { getDocument, loadBodyFixture, setCursor, openManuscriptEditor } from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'

const tools = {
  'disp-formula': {
    'label': 'Formula',
    'nodeType': 'disp-formula'
  },
  'disp-quote': {
    'label': 'Blockquote',
    'nodeType': 'disp-quote'
  },
  'table': {
    'label': 'Table',
    'nodeType': 'table-figure'
  }
}

const emptyFixture = `<p></p>`

Object.keys(tools).forEach(tool => {
  test(`Insert Isolated node to empty document: ${tools[tool].label}`, t => {
    testEmptyBodyIsolationNodeInsertion(t, tools[tool], tool)
  })
})

function testEmptyBodyIsolationNodeInsertion (t, tool, toolId) {
  let { doc, editor } = _setupEmptyEditor(t)
  t.equal(isToolActive(editor, toolId), false, 'Tool must be disabled')
  setCursor(editor, '_p-2.content', 0)
  t.equal(isToolActive(editor, toolId), true, 'Tool must be active')
  t.equal(doc.get('body').length, 1, 'Body should be not empty')
  let firstEl = doc.get('body').getNodeAt(0)
  t.equal(firstEl.type, 'p', 'First element should be paragraph')
  openInsertMenu(editor)
  let insertBtn = editor.find('.sc-menu-item.sm-insert-' + toolId)
  insertBtn.click()
  t.equal(doc.get('body').length, 1, 'Body should be not empty')
  let inserrtedEl = doc.get('body').getNodeAt(0)
  t.equal(inserrtedEl.type, tool.nodeType, 'First element should be ' + tool.nodeType)
  let undoBtn = editor.find('.sc-toggle-tool.sm-undo button')
  t.equal(!!undoBtn.getAttribute('disabled'), false, 'Undo tool should be active')
  undoBtn.click()
  t.end()
}

function _setupEmptyEditor (t) {
  let { app } = setupTestApp(t, { archiveId: 'blank' })
  let editor = openManuscriptEditor(app)
  let doc = getDocument(editor)
  loadBodyFixture(editor, emptyFixture)
  return { doc, editor }
}

function isToolActive (el, toolId) {
  openInsertMenu(el)
  const toolBtn = el.find('.sc-menu-item.sm-insert-' + toolId)
  return !toolBtn.getAttribute('disabled')
}

function openInsertMenu (el) {
  const insertDropdown = el.find('.sc-tool-dropdown.sm-insert .sc-button')
  // Check if dropdown is already active
  const isDropDownOpened = insertDropdown.hasClass('sm-active')
  if (!isDropDownOpened) {
    insertDropdown.click()
  }
}
