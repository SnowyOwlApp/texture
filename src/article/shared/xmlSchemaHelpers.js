import {
  XMLTextElement, XMLElementNode, XMLAnnotationNode,
  XMLAnchorNode, XMLInlineElementNode, XMLExternalNode,
  XMLContainerNode, XMLSchema, DocumentSchema,
  XMLTextElementConverter, XMLElementNodeConverter, XMLExternalNodeConverter, XMLNodeConverter,
  XMLDocumentImporter
} from 'substance'

// TODO: this should go into SubstanceLand

export function createSchema (XMLSchemaData, name, version, DocumentClass, docTypeParams) {
  let xmlSchema = XMLSchema.fromJSON(XMLSchemaData)
  const tagNames = xmlSchema.getTagNames()
  let nodeClasses = []
  // add node definitions and converters
  tagNames.forEach((tagName) => {
    const elementSchema = xmlSchema.getElementSchema(tagName)
    let targetTypes = []
    if (elementSchema.expr._allowedChildren) {
      targetTypes = Object.keys(elementSchema.expr._allowedChildren)
    }
    let NodeClass
    const elementType = elementSchema.type
    const type = elementSchema.name
    switch (elementType) {
      case 'element': {
        NodeClass = class _XMLElementNode extends XMLElementNode {}
        NodeClass.schema = {
          _childNodes: { type: ['array', 'id'], default: [], owned: true, targetTypes }
        }
        break
      }
      case 'hybrid': {
        throw new Error('Mixed element types are not supported yet.')
      }
      case 'text': {
        NodeClass = class _XMLTextElement extends XMLTextElement {}
        NodeClass.schema = {
          content: { type: 'text', targetTypes }
        }
        break
      }
      case 'annotation': {
        NodeClass = class _XMLAnnotationElement extends XMLAnnotationNode {}
        break
      }
      case 'anchor': {
        NodeClass = class _XMLAnchorNode extends XMLAnchorNode {}
        break
      }
      case 'inline-element': {
        NodeClass = class _XMLInlineElementNode extends XMLInlineElementNode {}
        NodeClass.schema = {
          _childNodes: { type: ['array', 'id'], default: [], owned: true, targetTypes }
        }
        break
      }
      case 'external':
      case 'not-implemented': {
        NodeClass = class _XMLExternalNode extends XMLExternalNode {}
        break
      }
      case 'container': {
        NodeClass = class _XMLContainerNode extends XMLContainerNode {}
        NodeClass.schema = {
          _childNodes: { type: ['array', 'id'], default: [], owned: true, targetTypes }
        }
        break
      }
      default:
        throw new Error('Illegal state')
    }
    NodeClass.type = type
    NodeClass._elementSchema = elementSchema

    nodeClasses.push(NodeClass)
  })

  let schema = new DocumentSchema({
    name,
    version,
    DocumentClass,
    // TODO: try to get rid of this
    defaultTextType: 'p'
  })
  schema.addNodes(nodeClasses)
  // HACK: add legacy API (Formerly XMLSchema)
  ;['getStartElement', 'validateElement', 'getElementSchema'].forEach(methodName => {
    schema[methodName] = (...args) => {
      return xmlSchema[methodName](...args)
    }
  })
  // other legacy functions that we had add manually
  schema.getName = () => { return name }
  schema.getDocTypeParams = () => { return docTypeParams }
  schema.xmlSchema = xmlSchema

  return schema
}

export function createXMLConverters (xmlSchema, tagNames) {
  const converters = []
  if (!tagNames) tagNames = xmlSchema.getTagNames()
  tagNames.forEach((tagName) => {
    const elementSchema = xmlSchema.getElementSchema(tagName)
    const name = elementSchema.name
    let ConverterClass
    switch (elementSchema.type) {
      case 'element': {
        ConverterClass = XMLElementNodeConverter
        break
      }
      case 'hybrid': {
        throw new Error('Mixed element types are not supported yet.')
      }
      case 'text': {
        ConverterClass = XMLTextElementConverter
        break
      }
      case 'annotation': {
        ConverterClass = XMLNodeConverter
        break
      }
      case 'anchor': {
        ConverterClass = XMLNodeConverter
        break
      }
      case 'inline-element': {
        // NOTE: Inline nodes can have children too
        ConverterClass = XMLElementNodeConverter
        break
      }
      case 'external':
      case 'not-implemented': {
        ConverterClass = XMLExternalNodeConverter
        break
      }
      case 'container': {
        ConverterClass = XMLElementNodeConverter
        break
      }
      default:
        throw new Error('Illegal state')
    }
    let converter = new ConverterClass(name)
    converters.push(converter)
  })
  return converters
}

export function createImporter (documentSchema, xmlSchema, customConverters = []) {
  // EXPERIMENTAL: we are using this in a hybrid scenario, where the actual document schema
  // is only partially using the xmlSchema
  let tagNames = xmlSchema.getTagNames()
    .filter(name => Boolean(documentSchema.getNodeClass(name)))
  let converters = customConverters.concat(createXMLConverters(xmlSchema, tagNames))
  return new XMLDocumentImporter({
    schema: documentSchema,
    xmlSchema: xmlSchema,
    idAttribute: 'id',
    converters
  })
}
