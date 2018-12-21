import { ModelComponent } from '../../kit'

export default class ManuscriptComponent extends ModelComponent {
  render ($$) {
    const articleModel = this.props.model
    const metadataModel = articleModel.getMetadataModel()
    const bodyModel = articleModel.getBodyModel()
    const titleModel = articleModel.getTitleModel()
    const authorsModel = metadataModel.getAuthorsModel()
    const abstractModel = articleModel.getAbstractModel()
    const footnotesModel = articleModel.getFootnotesModel()
    const referencesModel = articleModel.getReferencesModel()

    const SectionLabel = this.getComponent('section-label')
    const TitleComponent = this.getComponentForModel(titleModel)
    const AuthorsListComponent = this.getComponent('authors-list')
    const AbstractComponent = this.getComponentForModel(abstractModel)
    const BodyComponent = this.getComponentForModel(bodyModel)
    const FootnotesComponent = this.getComponentForModel(footnotesModel)
    const ReferenceListComponent = this.getComponent('reference-list')

    let el = $$('div').addClass('sc-manuscript').append(
      $$(SectionLabel, { label: 'title-label' }).addClass('sm-title'),
      $$(TitleComponent, {
        model: titleModel,
        placeholder: this.getLabel('title-placeholder')
      }).addClass('sm-title').ref('title')
    )

    if (authorsModel.length > 0) {
      el.append(
        $$(SectionLabel, {label: 'authors-label'}).addClass('sm-authors'),
        $$(AuthorsListComponent, {
          model: authorsModel,
          placeholder: this.getLabel('authors-placeholder')
        }).ref('authors')
      )
    }

    el.append(
      $$(SectionLabel, {label: 'abstract-label'}).addClass('sm-abstract'),
      $$(AbstractComponent, {
        model: abstractModel,
        placeholder: this.getLabel('abstract-placeholder')
      }).addClass('sm-abstract').ref('abstract')
    )

    el.append(
      $$(SectionLabel, {label: 'body-label'}).addClass('sm-body'),
      $$(BodyComponent, {
        model: bodyModel,
        placeholder: this.getLabel('body-placeholder')
      }).addClass('sm-body')
    )

    if (footnotesModel.length > 0) {
      el.append(
        $$(SectionLabel, {label: 'footnotes-label'}).addClass('sm-footnotes'),
        $$(FootnotesComponent, {
          model: footnotesModel
        })
      )
    }

    if (referencesModel.length > 0) {
      el.append(
        $$(SectionLabel, {label: 'references-label'}).addClass('sm-references'),
        $$(ReferenceListComponent, {
          model: referencesModel
        })
      )
    }

    return el
  }

  getClassNames () {
    return 'sc-manuscript'
  }

  _getPropertyComponent (property) {
    return this.getComponent(property.type)
  }
}
