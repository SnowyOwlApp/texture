import DocumentArchiveTypes from "./DocumentArchiveTypes"
import DocumentArchiveConfig from "./DocumentArchiveConfig";

export default class DocumentArchiveReadOnlyConfig extends DocumentArchiveConfig {
    constructor() {
        super(DocumentArchiveTypes.READ_ONLY)
    }
}