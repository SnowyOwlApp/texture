import { forEach } from 'substance'
import createEmptyJATS from '../util/createEmptyJATS'
import createJatsExporter from './createJatsExporter'

/*
  Output will have the following form:

  article:
    (
      front,
      body?,
      back?,
    )
  front:
    (
      journal-meta?,    // not supported yet
      article-meta,
      def-list?         // not supported yet
    )
  article-meta:
    (
      article-id*,      // not supported yet
      article-categories?,  // derived from subjects
      title-group?,
      contrib-group*,
      aff*,
      author-notes?,    // not supported yet
      pub-date*,
      volume?,
      issue?,
      isbn?,
      (((fpage,lpage?)?,page-range?)|elocation-id)?,
      history?,
      permissions?,     // not supported yet
      self-uri*,        // not supported yet
      related-article*, // not supported yet
      related-object*,  // not supported yet
      abstract?,
      trans-abstract*,
      kwd-group*,
      funding-group*,   // derived from awards
      conference*,      // not supported yet
      counts?,          // not supported yet
      custom-meta-group?  // not supported yet
    )
  back:
    (
      ack*, // not supported yet
      bio*, // not supported yet
      fn-group?,
      glossary?,  // not supported yet
      ref-list?,
      notes*, // not supported yet
      sec*  // do we want to support this at all?
    )

  TODO:
    Allow only one place for '<ack>', '<bio>', '<fn-group>', '<glossary>', '<notes>'
*/

export default function internal2jats (doc) { // eslint-disable-line
  let jats = createEmptyJATS()
  jats.$$ = jats.createElement.bind(jats)

  // we use this exporter for JATS compliant parts of our intneral document
  let jatsExporter = createJatsExporter(jats, doc)

  // metadata
  _populateFront(jats, doc, jatsExporter)
  _populateBody(jats, doc, jatsExporter)
  _populateBack(jats, doc, jatsExporter)

  return jats
}

function _populateFront (jats, doc, jatsExporter) {
  // TODO: journal-meta would go here, but is not supported yet

  _populateArticleMeta(jats, doc, jatsExporter)

  // TODO: def-list would go here, but is not supported yet
}

function _populateArticleMeta (jats, doc, jatsExporter) {
  const $$ = jats.$$
  let articleMeta = jats.createElement('article-meta')
  let articleRecord = doc.get('article-record')
  let permission = doc.get(articleRecord.permission)

  // article-id*
  // TODO not supported yet

  // article-categories?
  articleMeta.append(_exportSubjects(jats, doc))

  // title-group?
  articleMeta.append(_exportTitleGroup(jats, doc, jatsExporter))

  // contrib-group*
  ;[
    ['author', 'authors'],
    ['editor', 'editors']
  ].forEach(([type, collectionId]) => {
    let collection = doc.get(collectionId)
    articleMeta.append(
      _exportContribGroup(jats, doc, jatsExporter, collection, type)
    )
  })

  // aff*
  articleMeta.append(_exportAffiliations(jats, doc))

  // author-notes? // not supported yet

  // pub-date*,
  articleMeta.append(
    _exportDate($$, articleRecord, 'publishedDate', 'pub', 'pub-date')
  )

  // volume?,
  if (articleRecord.volume) {
    articleMeta.append($$('volume').append(articleRecord.volume))
  }

  // issue?,
  if (articleRecord.issue) {
    articleMeta.append($$('issue').append(articleRecord.issue))
  }

  // issue-title?,
  if (articleRecord['issue-title']) {
    articleMeta.append(
      $$('issue-title').append(
        jatsExporter.annotatedText([articleRecord.id, 'issue-title'])
      )
    )
  }

  // isbn?, // not supported yet

  // (((fpage,lpage?)?,page-range?)|elocation-id)?,
  if (articleRecord.elocationId) {
    articleMeta.append(
      $$('elocation-id').append(articleRecord.elocationId)
    )
  } else if (articleRecord.fpage && articleRecord.lpage) {
    // NOTE: last argument is used to resolve insert position, as we don't have means
    // yet to ask for insert position of multiple elements
    let pageRange = articleRecord.pageRange || articleRecord.fpage + '-' + articleRecord.lpage
    articleMeta.append(
      $$('fpage').append(articleRecord.fpage),
      $$('lpage').append(articleRecord.lpage),
      $$('page-range').append(pageRange)
    )
  }

  // history?,
  const historyEl = $$('history')
  historyEl.append(_exportDate($$, articleRecord, 'acceptedDate', 'accepted'))
  historyEl.append(_exportDate($$, articleRecord, 'receivedDate', 'received'))
  historyEl.append(_exportDate($$, articleRecord, 'revReceivedDate', 'rev-recd'))
  historyEl.append(_exportDate($$, articleRecord, 'revRequestedDate', 'rev-request'))
  // do not export <history> tag if there is no dates inside
  if (historyEl.getChildCount() > 0) {
    articleMeta.append(historyEl)
  }

  // permissions?,
  if (permission && !permission.isEmpty()) {
    articleMeta.append(
      jatsExporter.convertNode(permission)
    )
  }

  // self-uri*,        // not supported yet

  // related-article*, // not supported yet

  // related-object*,  // not supported yet

  // abstract?,
  articleMeta.append(
    _exportAbstract(jats, doc, jatsExporter)
  )

  // trans-abstract*, // not yet supported

  // kwd-group*,
  articleMeta.append(
    _exportKeywords(jats, doc)
  )

  // funding-group*,
  articleMeta.append(
    _exportAwards(jats, doc)
  )

  // conference*,      // not supported yet

  // counts?,          // not supported yet

  // custom-meta-group?  // not supported yet

  // replace the <article-meta> element
  let front = jats.find('article > front')
  let oldArticleMeta = front.find('article-meta')
  front.replaceChild(oldArticleMeta, articleMeta)
}

function _exportSubjects (jats, doc) {
  // NOTE: subjects are used to populate <article-categories>
  // - subjects are organized flat, not hierarchically
  // - `subject.category` is mapped to subject[content-type]
  // - subjects are grouped into <subj-groups> using their language property
  // group subjects by language
  // TODO: this should come from the article node
  let $$ = jats.$$
  let subjects = doc.get('subjects')
  let byLang = subjects.getChildren().reduce((byLang, subject) => {
    let lang = subject.language
    if (!byLang[lang]) {
      byLang[lang] = []
    }
    byLang[lang].push(subject)
    return byLang
  }, {})
  let articleCategories = $$('article-categories')
  forEach(byLang, (subjects, lang) => {
    let groupEl = $$('subj-group').attr('xml:lang', lang)
    groupEl.append(
      subjects.map(subject => {
        return $$('subject').attr({ 'content-type': subject.category }).text(subject.name)
      })
    )
    articleCategories.append(groupEl)
  })
  // only return if there have been converted subjects
  if (articleCategories.getChildCount() > 0) {
    return articleCategories
  }
}

function _exportTitleGroup (jats, doc, jatsExporter) {
  let $$ = jats.$$
  // ATTENTION: ATM only one, *the* title is supported
  // Potentially there are sub-titles, and JATS even supports more titles beyond this (e.g. for special purposes)
  let title = doc.get('title')
  let titleGroupEl = $$('title-group')
  let articleTitle = $$('article-title')
  _exportAnnotatedText(jatsExporter, title.getPath(), articleTitle)
  titleGroupEl.append(articleTitle)

  // translations
  titleGroupEl.append(
    title.getTranslations().map(translation => {
      return $$('trans-title-group').attr({ 'xml:lang': translation.language })
        .append(
          $$('trans-title').attr({ id: translation.id }).append(
            jatsExporter.annotatedText(translation.getPath())
          )
        )
    })
  )

  return titleGroupEl
}

function _exportContribGroup (jats, doc, exporter, personCollection, type) {
  // FIXME: this should not happen if we have general support for 'person-groups'
  // ATM, we only support authors, and editors.
  let $$ = jats.$$
  let contribs = personCollection.getChildren()
  let contribGroupEl = $$('contrib-group').attr('content-type', type)
  let groupedContribs = _groupContribs(contribs)
  for (let [groupId, persons] of groupedContribs) {
    // append persons without a group first
    if (groupId === 'NOGROUP') {
      persons.forEach(person => {
        contribGroupEl.append(_exportPerson($$, exporter, person))
      })
    // persons within a group are nested into an extra <contrib> layer
    } else {
      let group = doc.get(groupId)
      contribGroupEl.append(_exportGroup($$, exporter, group, persons))
    }
  }
  if (contribGroupEl.getChildCount() > 0) {
    return contribGroupEl
  }
}

/*
  Uses group association of person nodes to create groups

  [p1,p2g1,p3g2,p4g1] => {p1: p1, g1: [p2,p4], g2: [p3] }
*/
function _groupContribs (contribs) {
  let groups = new Map()
  groups.set('NOGROUP', [])
  for (let contrib of contribs) {
    let groupId = contrib.group
    if (groupId) {
      if (!groups.has(groupId)) {
        groups.set(groupId, [])
      }
      groups.get(groupId).push(contrib)
    } else {
      groups.get('NOGROUP').push(contrib)
    }
  }
  return groups
}

function _exportPerson ($$, exporter, node) {
  let el = $$('contrib').attr({
    'contrib-type': 'person',
    'equal-contrib': node.equalContrib ? 'yes' : 'no',
    'corresp': node.corresp ? 'yes' : 'no',
    'deceased': node.deceased ? 'yes' : 'no'
  })
  el.append(
    $$('name').append(
      _createTextElement($$, node.surname, 'surname'),
      _createTextElement($$, node.givenNames, 'given-names'),
      _createTextElement($$, node.prefix, 'prefix'),
      _createTextElement($$, node.suffix, 'suffix')
    ),
    _createTextElement($$, node.email, 'email'),
    _createTextElement($$, node.alias, 'string-name', {'content-type': 'alias'}),
    _createBioElement($$, exporter, node)
  )
  node.affiliations.forEach(organisationId => {
    el.append(
      $$('xref').attr('ref-type', 'aff').attr('rid', organisationId)
    )
  })
  node.awards.forEach(awardId => {
    el.append(
      $$('xref').attr('ref-type', 'award').attr('rid', awardId)
    )
  })
  return el
}

function _createBioElement ($$, exporter, node) {
  let bio = node.getBio()
  if (bio) {
    // NOTE: we don't want to export empty containers
    // e.g. if there is only one empty paragraph we are not exporting anything
    if (bio.length === 1 && bio.children[0].isEmpty()) {
      return
    }
    let bioEl = exporter.convertNode(bio)
    return bioEl
  }
}

function _exportGroup ($$, exporter, node, groupMembers) {
  /*
    <contrib id="${node.id}" contrib-type="group" equal-contrib="yes|no" corresp="yes|no">
      <collab>
        <named-content content-type="name">${node.name}</named-content>
        <email>${node.email}</email>
        <$ for (let affId of node.affiliations) {$>
          <xref ref-type="aff" rid=${affId} />
        <$ } $>
        <$ for (let awardId of node.awards) {$>
          <xref ref-type="award" rid=${awardId} />
        <$ } $>
        <contrib-group contrib-type="group-member">
          <$ for (let person of groupMembers) {$>
            <Person node=${person} />
          <$ } $>
        </contrib-group>
        </collab>
    </contrib>
  */
  let contribEl = $$('contrib').attr({
    'id': node.id,
    'contrib-type': 'group',
    'equal-contrib': node.equalContrib ? 'yes' : 'no',
    'corresp': node.corresp ? 'yes' : 'no'
  })
  let collab = $$('collab')
  collab.append(
    $$('named-content').attr('content-type', 'name').append(node.name),
    $$('email').append(node.email)
  )
  // Adds affiliations to group
  node.affiliations.forEach(organisationId => {
    collab.append(
      $$('xref').attr('ref-type', 'aff').attr('rid', organisationId)
    )
  })
  // Add awards to group
  node.awards.forEach(awardId => {
    collab.append(
      $$('xref').attr('ref-type', 'award').attr('rid', awardId)
    )
  })
  // Add group members
  // <contrib-group contrib-type="group-member">
  let contribGroup = $$('contrib-group').attr('contrib-type', 'group-member')
  groupMembers.forEach(person => {
    let contribEl = _exportPerson($$, exporter, person)
    contribGroup.append(contribEl)
  })
  collab.append(contribGroup)
  contribEl.append(collab)
  return contribEl
}

function _exportAffiliations (jats, doc) {
  let $$ = jats.$$
  let organisations = doc.get('organisations')
  let orgEls = organisations.getChildren().map(node => {
    let el = $$('aff').attr('id', node.id)
    el.append(_createTextElement($$, node.institution, 'institution', {'content-type': 'orgname'}))
    el.append(_createTextElement($$, node.division1, 'institution', {'content-type': 'orgdiv1'}))
    el.append(_createTextElement($$, node.division2, 'institution', {'content-type': 'orgdiv2'}))
    el.append(_createTextElement($$, node.division3, 'institution', {'content-type': 'orgdiv3'}))
    el.append(_createTextElement($$, node.street, 'addr-line', {'content-type': 'street-address'}))
    el.append(_createTextElement($$, node.addressComplements, 'addr-line', {'content-type': 'complements'}))
    el.append(_createTextElement($$, node.city, 'city'))
    el.append(_createTextElement($$, node.state, 'state'))
    el.append(_createTextElement($$, node.postalCode, 'postal-code'))
    el.append(_createTextElement($$, node.country, 'country'))
    el.append(_createTextElement($$, node.phone, 'phone'))
    el.append(_createTextElement($$, node.fax, 'fax'))
    el.append(_createTextElement($$, node.email, 'email'))
    el.append(_createTextElement($$, node.uri, 'uri', {'content-type': 'link'}))
    return el
  })
  return orgEls
}

function _exportDate ($$, node, prop, dateType, tag) {
  const date = node[prop]
  // Do not export a date without value
  if (!date) return

  const tagName = tag || 'date'
  const el = $$(tagName).attr('date-type', dateType)
    .attr('iso-8601-date', date)

  const year = date.split('-')[0]
  const month = date.split('-')[1]
  const day = date.split('-')[2]
  if (_isDateValid(date)) {
    el.append(
      $$('day').append(day),
      $$('month').append(month),
      $$('year').append(year)
    )
  } else if (_isYearMonthDateValid(date)) {
    el.append(
      $$('month').append(month),
      $$('year').append(year)
    )
  } else if (_isYearDateValid(date)) {
    el.append(
      $$('year').append(year)
    )
  }
  return el
}

function _isDateValid (str) {
  const regexp = /^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/
  if (!regexp.test(str)) return false
  return true
}

function _isYearMonthDateValid (str) {
  const regexp = /^[0-9]{4}-(0[1-9]|1[0-2])$/
  if (!regexp.test(str)) return false
  return true
}

function _isYearDateValid (str) {
  const regexp = /^[0-9]{4}$/
  if (!regexp.test(str)) return false
  return true
}

function _createTextElement ($$, text, tagName, attrs) {
  if (text) {
    let el = $$(tagName).append(text)
    forEach(attrs, (value, key) => {
      el.attr(key, value)
    })
    return el
  }
}

/**
 * @param {DOMElement} jats the JATS DOM to export into
 * @param {Document} doc the document to convert from
 * @param {XMLExporter} jatsExporter an exporter instance used to export nested nodes
 */
function _exportAbstract (jats, doc, jatsExporter) {
  const $$ = jats.$$
  let abstract = doc.get('abstract')
  let els = []

  // <abstract>
  let abstractEl = $$('abstract')
  // the abstract element itself is required
  // but we skip empty content
  if (!_isContainerEmpty(abstract)) {
    abstract.getChildren().forEach(p => {
      abstractEl.append(jatsExporter.convertNode(p))
    })
  }
  els.push(abstractEl)

  // translations
  abstract.getTranslations().forEach(translation => {
    if (!_isContainerEmpty(translation)) {
      let transAbstractEl = $$('trans-abstract').attr({ id: translation.id, 'xml:lang': translation.language })
        .append(
          translation.getChildren().map(child => jatsExporter.convertNode(child))
        )
      els.push(transAbstractEl)
    }
  })
  return els
}

function _exportKeywords (jats, doc) {
  const $$ = jats.$$
  // TODO: keywords should be translatables
  const keywords = doc.get('keywords')
  let byLang = keywords.getChildren().reduce((byLang, keyword) => {
    let lang = keyword.language
    if (!byLang[lang]) {
      byLang[lang] = []
    }
    byLang[lang].push(keyword)
    return byLang
  }, {})
  let keywordGroups = []
  forEach(byLang, (keywords, lang) => {
    let groupEl = $$('kwd-group').attr('xml:lang', lang)
    groupEl.append(
      keywords.map(keyword => {
        return $$('kwd').attr({ 'content-type': keyword.category }).text(keyword.name)
      })
    )
    keywordGroups.push(groupEl)
  })
  return keywordGroups
}

function _exportAwards (jats, doc) {
  const $$ = jats.$$
  let awards = doc.get('awards').getChildren()
  if (awards.length > 0) {
    let fundingGroupEl = $$('funding-group')
    awards.forEach(award => {
      let el = $$('award-group').attr('id', award.id)
      let institutionWrapEl = $$('institution-wrap')
      institutionWrapEl.append(_createTextElement($$, award.fundRefId, 'institution-id', {'institution-id-type': 'FundRef'}))
      institutionWrapEl.append(_createTextElement($$, award.institution, 'institution'))
      el.append(
        $$('funding-source').append(institutionWrapEl),
        _createTextElement($$, award.awardId, 'award-id')
      )
      fundingGroupEl.append(el)
    })
    return fundingGroupEl
  }
}

function _populateBody (jats, doc, jatsExporter) {
  let body = doc.get('body')
  if (!_isContainerEmpty(body)) {
    let bodyEl = jatsExporter.convertNode(body)
    let oldBody = jats.find('article > body')
    oldBody.parentNode.replaceChild(oldBody, bodyEl)
  }
}

function _populateBack (jats, doc, jatsExporter) {
  let $$ = jats.$$
  let backEl = jats.find('article > back')
  /*
    back:
    (
      fn-group?,
      ref-list?,
    )
  */
  let footnotes = doc.get('footnotes').getChildren()
  if (footnotes.length > 0) {
    backEl.append(
      $$('fn-group').append(
        footnotes.map(footnote => {
          return jatsExporter.convertNode(footnote)
        })
      )
    )
  }

  let references = doc.get('references').getChildren()
  if (references.length > 0) {
    backEl.append(
      $$('ref-list').append(
        references.map(ref => {
          return jatsExporter.convertNode(ref)
        })
      )
    )
  }
}

function _exportAnnotatedText (jatsExporter, path, el) {
  el.append(jatsExporter.annotatedText(path))
}

function _isContainerEmpty (container) {
  if (container.getLength() === 0) return true
  if (container.getLength() > 1) return false
  let first = container.getNodeAt(0)
  return first && first.isText() && !first.getText()
}
