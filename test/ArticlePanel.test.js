import { test } from 'substance-test'
import setupTestApp from './shared/setupTestApp'

test('ArticlePanel: open every view', t => {
  let { app } = setupTestApp(t)
  let articlePanel = app.find('.sc-article-panel')
  articlePanel.send('updateViewName', 'manuscript')
  articlePanel.send('updateViewName', 'metadata')
  // FIXME: bring back reader panel
  // articlePanel.send('updateViewName', 'reader')
  t.pass('All views should have been opened without error.')
  t.end()
})

// FIXME: bring back reader view
// test('ArticlePanel: no contenteditable in reader view', t => {
//   let { app } = setupTestApp(t)
//   let articlePanel = app.find('.sc-article-panel')
//   articlePanel.send('updateViewName', 'reader')
//   let editable = articlePanel.find('*[contenteditable=true]')
//   t.nil(editable, 'There should be no editable element.')
//   t.end()
// })
