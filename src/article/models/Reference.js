import { DocumentNode } from 'substance'

// Note: this is used as a indicator class for all types of references
export default class Reference extends DocumentNode {
  get _isReference () { return true }
}

Reference.schema = {
  type: 'reference'
}
