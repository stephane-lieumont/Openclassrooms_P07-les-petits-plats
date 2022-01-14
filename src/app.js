import API from './scripts/Api.class'
import Search from './scripts/Search.class'

import urlData from './mock/receipts.json'

async function app () {
  const Api = new API(urlData)
  const data = await Api.getAllReceipts()
  const searchEngine = new Search(data)

  searchEngine.init()
}

app()
