import { sendRequest, forEach } from 'substance'

export default class HttpStorageClient {

  constructor(storageConfig) {
    this.apiUrl = storageConfig.getStorageUrl()
  }

  /*
    @returns a Promise for a raw archive, i.e. the data for a DocumentArchive.
  */
  read(archiveId) {
    let url = this.apiUrl
    if (archiveId) {
      url = url + '/' + archiveId
    }
    return sendRequest({
      method: 'GET',
      url
    }).then(response => {
      return JSON.parse(response)
    })
  }

  write(archiveId, data) {
    let form = new FormData()
    forEach(data.resources, (record, filePath) => {
      if (record.encoding === 'blob') {
        // removing the blob from the record and submitting it as extra part
        form.append(record.id, record.data, filePath)
        delete record.data
      }
    })
    form.append('_archive', JSON.stringify(data))
    let url = this.apiUrl
    if (archiveId) {
      url = url + '/' + archiveId
    }
    return sendRequest({
      method: 'PUT',
      url,
      data: form
    })
  }

}
