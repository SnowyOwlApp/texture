import { DefaultDOMElement, importNodeIntoDocument, selectionHelpers, last } from 'substance'
import createJatsImporter from './converter/r2t/createJatsImporter'
import { DISP_FORMULA, DISP_QUOTE, FIGURE_SNIPPET,
  FOOTNOTE_SNIPPET, PERSON_SNIPPET, TABLE_SNIPPET
} from './ArticleSnippets'

const elementSpippetsMap = {
  'disp-formula': DISP_FORMULA,
  'disp-quote': DISP_QUOTE,
  'figure': FIGURE_SNIPPET,
  'footnote': FOOTNOTE_SNIPPET,
  'person': PERSON_SNIPPET,
  'table-figure': TABLE_SNIPPET
}

export function createEmptyElement (tx, elName, ...snippetParams) {
  const snippet = elementSpippetsMap[elName]
  if (!snippet) {
    throw new Error('There is no snippet for element', elName)
  }
  let snippetEl = DefaultDOMElement.parseSnippet(snippet(...snippetParams).trim(), 'xml')
  let docSnippet = tx.getDocument().createSnippet()
  let jatsImporter = createJatsImporter(docSnippet)
  let node = jatsImporter.convertElement(snippetEl)
  return importNodeIntoDocument(tx, node)
}

export function setContainerSelection (tx, node, surfaceId) {
  if (!surfaceId) surfaceId = node.id
  const p = node.find('p')
  if (p) {
    let path = [p.id, 'content']
    let newSelection = {
      type: 'property',
      path,
      startOffset: 0,
      surfaceId
    }
    tx.setSelection(newSelection)
  }
}

export function importFigurePanel (tx, file, path) {
  const mimeData = file.type.split('/')
  const graphic = tx.create({
    'type': 'graphic'
  })
  graphic.attr({
    'mime-subtype': mimeData[1],
    'mimetype': mimeData[0],
    'xlink:href': path
  })
  const permission = tx.create({
    'type': 'permission'
  })
  const caption = tx.create({
    'type': 'caption'
  }).append(
    tx.create({type: 'p'})
  )
  const figurePanel = tx.create({
    'type': 'figure-panel',
    'content': graphic.id,
    'caption': caption.id,
    'permission': permission.id
  })
  return figurePanel
}

export function importFigures (tx, sel, files, paths) {
  if (files.length === 0) return

  let containerPath = sel.containerPath
  let figures = files.map((file, idx) => {
    let path = paths[idx]
    let mimeType = file.type
    let figure = createEmptyElement(tx, 'figure')
    let panel = tx.get(figure.panels[0])
    let graphic = panel.getContent()
    graphic.href = path
    graphic.mimeType = mimeType
    // Note: this is necessary because tx.insertBlockNode()
    // selects the inserted node
    // TODO: maybe we should change the behavior of tx.insertBlockNode()
    // so that it is easier to insert multiple nodes in a row
    if (idx !== 0) {
      tx.break()
    }
    tx.insertBlockNode(figure)
    return figure
  })
  selectionHelpers.selectNode(tx, last(figures).id, containerPath)
}

export function insertTableFigure (tx, rows, columns) {
  return createEmptyElement(tx, 'table-figure', rows, columns)
}
