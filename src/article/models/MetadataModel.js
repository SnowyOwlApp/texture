// import TranslationCollectionModel from './TranslationCollectionModel'
// import FigureCollectionModel from './FigureCollectionModel'
// import TableCollectionModel from './TableCollectionModel'

/**
 * This is an artificial Model used to control the content displayed in the Metadata view.
 */
export default class MetadataModel {
  constructor (api) {
    this._api = api

    let articleModel = api.getModelById('article')
    let metadataModel = articleModel.getMetadataModel()

    this._sections = [
      { name: 'authors', model: metadataModel.getAuthorsModel() },
      { name: 'editors', model: metadataModel.getEditorsModel() },
      { name: 'groups', model: metadataModel.getGroupsModel() },
      { name: 'organisations', model: metadataModel.getOrganisationsModel() },
      { name: 'awards', model: metadataModel.getAwardsModel() },
      { name: 'references', model: articleModel.getReferencesModel() },
      { name: 'keywords', model: metadataModel.getKeywordsModel() },
      { name: 'subjects', model: metadataModel.getSubjectsModel() },
      // FIXME: bring back translations
      // { name: 'translations', model: new TranslationCollectionModel(api) },
      // FIXME: bring back 'article-record' section
      // { name: 'article', model: api.getModelById('article-record') },
      // FIXME: bring back figures section
      // { name: 'figures', model: new FigureCollectionModel(api) },
      // FIXME: bring back tables section
      // { name: 'tables', model: new TableCollectionModel(api) },
      { name: 'footnotes', model: articleModel.getFootnotesModel() }
    ]
  }

  getSections () {
    return this._sections
  }
}
