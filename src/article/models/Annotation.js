import { AnnotationMixin, DocumentNode } from 'substance'

export default class Annotation extends AnnotationMixin(DocumentNode) {}
Annotation.schema = {
  type: 'annotation'
}
