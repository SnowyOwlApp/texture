import { test } from 'substance-test'
import { openManuscriptEditor, openMetadataEditor, getDocument, getSelectionState, setSelection, fixture } from './shared/integrationTestHelpers'
import setupTestApp from './shared/setupTestApp'
import { getLabel } from '../index'

const manuscriptFootnoteSelector = '.sc-manuscript > .sc-footnote-group > .sc-footnote'
const tableFootnoteSelector = '.sc-table-figure > .se-table-figure-footnotes > .sc-footnote'
const metadataEditorFootnoteSelector = '.sc-card > .sc-footnote'
const metadataEditorTableFootnoteSelector = '.sc-card > .sc-table-figure-metadata .sc-footnote'
const footnoteContentXpath = ['article', 'content', 'back', 'footnotes', 'fn', 'p']
const tableFootnoteContentXpath = ['article', 'content', 'body', 'table-figure', 'fn', 'p']

test('Footnotes: add a footnote in the manuscript while selection is outside the table figure', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openManuscriptEditor(app)
  t.equal(editor.findAll(manuscriptFootnoteSelector).length, 1, 'there should be one manuscript footnote')
  t.equal(editor.findAll(tableFootnoteSelector).length, 2, 'there should be two table footnotes')
  setSelection(editor, 'p-0.content', 1)
  _insertFootnoteIntoManuscript(editor)
  t.equal(editor.findAll(manuscriptFootnoteSelector).length, 2, 'there should be two manuscript footnotes')
  t.equal(editor.findAll(tableFootnoteSelector).length, 2, 'there should be two table footnotes')
  const xpath = _getCurrentXpath(editor)
  t.deepEqual(xpath, footnoteContentXpath, 'selection should be inside manuscript footnote')
  t.end()
})

test('Footnotes: add a footnote in the manuscript while selection is on isolated node with a table figure', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openManuscriptEditor(app)
  const editorSession = editor.editorSession
  // set selection on table-figure isolated node
  editorSession.setSelection({
    type: 'node',
    nodeId: 'table-1',
    surfaceId: 'body',
    containerPath: ['body', 'content']
  })
  _insertFootnoteIntoManuscript(editor)
  t.equal(editor.findAll(manuscriptFootnoteSelector).length, 1, 'there should be one manuscript footnote')
  t.equal(editor.findAll(tableFootnoteSelector).length, 3, 'there should be three table footnotes')
  const xpath = _getCurrentXpath(editor)
  t.deepEqual(xpath, tableFootnoteContentXpath, 'selection should be inside table footnote')
  t.end()
})

test('Footnotes: add a footnote in the manuscript while selection is inside a table cell', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openManuscriptEditor(app)
  // set selection inside table cell
  setSelection(editor, 't-1_2_1.content', 1)
  _insertFootnoteIntoManuscript(editor)
  t.equal(editor.findAll(manuscriptFootnoteSelector).length, 1, 'there should be one manuscript footnote')
  t.equal(editor.findAll(tableFootnoteSelector).length, 3, 'there should be three table footnotes')
  const xpath = _getCurrentXpath(editor)
  t.deepEqual(xpath, tableFootnoteContentXpath, 'selection should be inside table footnote')
  t.end()
})

test('Footnotes: add a footnote in the manuscript while selection is on table cell', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openManuscriptEditor(app)
  const editorSession = editor.editorSession
  // set selection on table cell
  editorSession.setSelection({
    type: 'custom',
    customType: 'table',
    nodeId: 't-1',
    surfaceId: 't-1',
    data: {
      anchorCellId: 't-1_2_2',
      focusCellId: 't-1_2_2'
    }
  })
  _insertFootnoteIntoManuscript(editor)
  t.equal(editor.findAll(manuscriptFootnoteSelector).length, 1, 'there should be one manuscript footnote')
  t.equal(editor.findAll(tableFootnoteSelector).length, 3, 'there should be three table footnotes')
  const xpath = _getCurrentXpath(editor)
  t.deepEqual(xpath, tableFootnoteContentXpath, 'selection should be inside table footnote')
  t.end()
})

test('Footnotes: add a footnote in the manuscript while selection is inside a table caption', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openManuscriptEditor(app)
  // set selection inside table figure caption
  setSelection(editor, 'table-1-caption-p-1.content', 1)
  _insertFootnoteIntoManuscript(editor)
  t.equal(editor.findAll(manuscriptFootnoteSelector).length, 1, 'there should be one manuscript footnote')
  t.equal(editor.findAll(tableFootnoteSelector).length, 3, 'there should be three table footnotes')
  const xpath = _getCurrentXpath(editor)
  t.deepEqual(xpath, tableFootnoteContentXpath, 'selection should be inside table footnote')
  t.end()
})

test('Footnotes: add a footnote in the metadata while selection is outside the table figure', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openMetadataEditor(app)
  let api = editor.context.api
  t.equal(editor.findAll(metadataEditorFootnoteSelector).length, 1, 'there should be one footnote')
  t.equal(editor.findAll(metadataEditorTableFootnoteSelector).length, 2, 'there should be two footnotes')
  api.selectModel('article-record')
  _insertFootnoteIntoMetadataEditor(editor)
  t.equal(editor.findAll(metadataEditorFootnoteSelector).length, 2, 'there should be two footnotes')
  t.equal(editor.findAll(metadataEditorTableFootnoteSelector).length, 2, 'there should be two footnotes')
  const xpath = _getCurrentXpath(editor)
  t.deepEqual(xpath, footnoteContentXpath, 'selection should be inside manuscript footnote')
  t.end()
})

test('Footnotes: add a footnote in the metadata while selection is on card with a table figure', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openMetadataEditor(app)
  let api = editor.context.api
  api.selectModel('table-1')
  _insertFootnoteIntoMetadataEditor(editor)
  t.equal(editor.findAll(metadataEditorFootnoteSelector).length, 1, 'there should be one footnote')
  t.equal(editor.findAll(metadataEditorTableFootnoteSelector).length, 3, 'there should be three footnotes')
  const xpath = _getCurrentXpath(editor)
  t.deepEqual(xpath, tableFootnoteContentXpath, 'selection should be inside manuscript footnote')
  t.end()
})

test('Footnotes: add a footnote in the metadata while selection is inside a table cell', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openMetadataEditor(app)
  // set selection inside table cell
  setSelection(editor, 't-1_2_1.content', 1)
  _insertFootnoteIntoMetadataEditor(editor)
  t.equal(editor.findAll(metadataEditorFootnoteSelector).length, 1, 'there should be one manuscript footnote')
  t.equal(editor.findAll(metadataEditorTableFootnoteSelector).length, 3, 'there should be three table footnotes')
  const xpath = _getCurrentXpath(editor)
  t.deepEqual(xpath, tableFootnoteContentXpath, 'selection should be inside table footnote')
  t.end()
})

test('Footnotes: add a footnote in the metadata while selection is on table cell', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openMetadataEditor(app)
  const editorSession = editor.editorSession
  // set selection on table cell
  editorSession.setSelection({
    type: 'custom',
    customType: 'table',
    nodeId: 't-1',
    surfaceId: 't-1',
    data: {
      anchorCellId: 't-1_2_2',
      focusCellId: 't-1_2_2'
    }
  })
  _insertFootnoteIntoMetadataEditor(editor)
  t.equal(editor.findAll(metadataEditorFootnoteSelector).length, 1, 'there should be one manuscript footnote')
  t.equal(editor.findAll(metadataEditorTableFootnoteSelector).length, 3, 'there should be three table footnotes')
  const xpath = _getCurrentXpath(editor)
  t.deepEqual(xpath, tableFootnoteContentXpath, 'selection should be inside table footnote')
  t.end()
})

test('Footnotes: add a footnote in the metadata while selection is inside a table caption', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openMetadataEditor(app)
  // set selection inside table cell
  setSelection(editor, 'table-1-caption-p-1.content', 1)
  _insertFootnoteIntoMetadataEditor(editor)
  t.equal(editor.findAll(metadataEditorFootnoteSelector).length, 1, 'there should be one manuscript footnote')
  t.equal(editor.findAll(metadataEditorTableFootnoteSelector).length, 3, 'there should be three table footnotes')
  const xpath = _getCurrentXpath(editor)
  t.deepEqual(xpath, tableFootnoteContentXpath, 'selection should be inside table footnote')
  t.end()
})

test('Footnotes: remove a manuscript footnote', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openManuscriptEditor(app)
  let doc = getDocument(editor)
  t.notNil(editor.find('[data-id=fn-1]'), 'the footnote should be visible')
  setSelection(editor, 'fn-1-p-1.content', 1)
  const removeBtn = _selectRemoveButton(editor)
  t.ok(removeBtn, 'there should be a remove button')
  removeBtn.click()
  t.isNil(doc.get('fn-1'), 'the footnote should have been removed from the model')
  t.isNil(editor.find('[data-id=fn-1]'), '.. and should not be visible anymore')
  t.end()
})

test('Footnotes: remove a table footnote', t => {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openManuscriptEditor(app)
  let doc = getDocument(editor)
  t.notNil(editor.find('[data-id=table-1-fn-1]'), 'the table footnote should be visible')
  setSelection(editor, 'table-1-fn-1-p-1.content', 1)
  const removeBtn = _selectRemoveButton(editor)
  t.ok(removeBtn, 'there should be a remove button')
  removeBtn.click()
  t.isNil(doc.get('table-1-fn-1'), 'the table footnote should have been removed from the model')
  t.isNil(editor.find('[data-id=table-1-fn-1]'), '.. and should not be visible anymore')
  t.end()
})

test('Footnotes: reference a footnote from a paragraph in the manuscript body', t => {
  _testInsertXref(t, ['p-0', 'content'], 'fn', 'fn', 'fn-1', '1')
})

test('Footnotes: reference a footnote from a table-cell', t => {
  _testInsertXref(t, ['t-1_2_1', 'content'], 'fn', 'table-fn', 'table-1-fn-1', '*')
})

test('Footnotes: reference a footnote from a table caption', t => {
  _testInsertXref(t, ['table-1-caption-p-1', 'content'], 'fn', 'table-fn', 'table-1-fn-1', '*')
})

test('Footnotes: add a reference citation to a paragraph in the body', t => {
  _testInsertXref(t, ['p-0', 'content'], 'bibr', 'bibr', 'r-1', '[1]')
})

test('Footnotes: add a reference citation into a table title', t => {
  _testInsertXref(t, ['table-1', 'title'], 'bibr', 'bibr', 'r-1', '[1]')
})

test('Footnotes: add a reference citation into a table caption', t => {
  _testInsertXref(t, ['table-1-caption-p-1', 'content'], 'bibr', 'bibr', 'r-1', '[1]')
})

test('Footnotes: add a reference citation into a table cell', t => {
  _testInsertXref(t, ['t-1_2_1', 'content'], 'bibr', 'bibr', 'r-1', '[1]')
})

function _testInsertXref (t, path, refTool, refType, rid, label) {
  let { app } = setupTestApp(t, fixture('cross-references'))
  let editor = openManuscriptEditor(app)
  let doc = getDocument(editor)
  setSelection(editor, path, 1)
  _insertCrossRef(editor, refTool, rid)
  let annos = doc.getAnnotations(path)
  let xref = annos[0]
  if (xref) {
    let actual = {
      type: xref.type,
      refType: xref.getAttribute('ref-type'),
      rid: xref.getAttribute('rid')
    }
    let expected = {
      type: 'xref',
      refType,
      rid
    }
    t.deepEqual(actual, expected, 'a xref should have been created')
    t.equal(getLabel(xref), label, 'label should be correct')
  } else {
    t.fail('xref has not been created')
  }
  t.end()
}

function _insertCrossRef (editor, refType, rid) {
  let citeMenu = editor.find('.sc-tool-dropdown.sm-cite')
  // open cite menu
  citeMenu.find('button').el.click()
  // click respective tool
  citeMenu.find(`.sm-insert-xref-${refType}`).el.click()
  // ..then the xref should be inserted with empty content
  // click on the target option with the given node id
  editor.find(`.sc-edit-xref-tool > .se-option > *[data-id=${rid}]`).click()
}

function _insertFootnoteIntoManuscript (el) {
  const insertDropdown = el.find('.sc-tool-dropdown.sm-insert .sc-button')
  // Check if dropdown is already active
  const isDropDownOpened = insertDropdown.hasClass('sm-active')
  if (!isDropDownOpened) {
    insertDropdown.click()
  }
  let insertFootnoteBtn = el.find('.sc-menu-item.sm-insert-footnote')
  insertFootnoteBtn.click()
}

function _insertFootnoteIntoMetadataEditor (el) {
  const addDropdown = el.find('.sc-tool-dropdown.sm-add .sc-button')
  // Check if dropdown is already active
  const isDropDownOpened = addDropdown.hasClass('sm-active')
  if (!isDropDownOpened) {
    addDropdown.click()
  }
  let addFootnoteBtn = el.find('.sc-menu-item.sm-add-footnote')
  addFootnoteBtn.click()
}

function _getCurrentXpath (el) {
  const selectionState = getSelectionState(el)
  return selectionState.xpath
}

function _selectRemoveButton (el) {
  const removeBtn = el.find('.sm-remove-footnote .sc-button')
  return removeBtn
}
