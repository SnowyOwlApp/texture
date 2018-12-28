import ArticleHTMLConverters from './converter/html/ArticleHTMLConverters'
import EntityLabelsPackage from './shared/EntityLabelsPackage'
import LanguagesPackage from './LanguagesPackage'

import FigureModel from './models/FigureModel'

import FigureLabelGenerator from './shared/FigureLabelGenerator'
import NumberedLabelGenerator from './shared/NumberedLabelGenerator'

export default {
  name: 'TextureArticle',
  configure (config) {
    config.import(EntityLabelsPackage)

    // enable rich-text support for clipboard
    ArticleHTMLConverters.forEach(converter => {
      config.addConverter('html', converter)
    })

    // Registry of available languages
    config.import(LanguagesPackage)

    config.addModel('figure', FigureModel)


    // Experimental
    config.setLabelGenerator('references', NumberedLabelGenerator, {
      template: '[$]',
      and: ',',
      to: '-'
    })
    config.setLabelGenerator('tables', NumberedLabelGenerator, {
      name: 'Table',
      plural: 'Tables',
      and: ',',
      to: '-'
    })
    config.setLabelGenerator('footnotes', NumberedLabelGenerator, {
      template: '$',
      and: ',',
      to: '-'
    })
    config.setLabelGenerator('formulas', NumberedLabelGenerator, {
      template: '($)',
      and: ',',
      to: '-'
    })
    // ATTENTION: FigureLabelGenerator works a bit differently
    // TODO: consolidate LabelGenerators and configuration
    // e.g. it does not make sense to say 'setLabelGenerator' but then only provide a configuration for 'NumberedLabelGenerator'
    config.setLabelGenerator('figures', FigureLabelGenerator, {
      singular: 'Figure $',
      plural: 'Figures $',
      and: ',',
      to: '-'
    })
  }
}
