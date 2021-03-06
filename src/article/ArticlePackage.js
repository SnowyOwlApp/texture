import { BasePackage } from '../kit'
import ArticleConfigurator from './ArticleConfigurator'
import ModelPackage from './ArticleModelPackage'
import EditorPackage from './editor/EditorPackage'
import MetadataPackage from './metadata/MetadataPackage'
import ReaderPackage from './reader/ReaderPackage'
import ArticlePanel from './ArticlePanel'
import ManuscriptEditor from './editor/ManuscriptEditor'
import MetadataEditor from './metadata/MetadataEditor'
import ArticleReader from './reader/ArticleReader'

export default {
  name: 'Article',
  configure (parentConfig) {
    parentConfig.addComponent('article', ArticlePanel)
    // create a configuration scope
    let config = parentConfig.createScope('article')

    // used during import
    let modelConfig = new ArticleConfigurator().import(ModelPackage)
    config.setConfiguration('model', modelConfig)
    // used for the manuscript editor view
    let manuscriptEditorConfig = ArticleConfigurator.createFrom(modelConfig).import(EditorPackage)
    config.setConfiguration('manuscript', manuscriptEditorConfig)
    // used for the metadata editor view
    let metadataEditorConfig = ArticleConfigurator.createFrom(modelConfig).import(MetadataPackage)
    config.setConfiguration('metadata', metadataEditorConfig)
    // used for the reader view
    let readerConfig = ArticleConfigurator.createFrom(modelConfig).import(ReaderPackage)
    config.setConfiguration('reader', readerConfig)

    config.import(BasePackage)
    // UI stuff for the ArticlePanel
    config.addComponent('manuscript-editor', ManuscriptEditor)
    config.addComponent('metadata-editor', MetadataEditor)
    config.addComponent('article-reader', ArticleReader)
  }
}
