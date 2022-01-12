export default class API {
  constructor (url) {
    this._url = url
  }

  /**
   * Simulate Request for receipt datas
   * @returns {Promise}
   */
  async getAllReceipts () {
    return fetch(this._url)
      .then(response => response.json())
      .then(response => {
        return response.receipts
      })
      .catch(err => {
        throw new Error('La requete getAllReceipts api a échoué : ', err)
      })
  }
}
