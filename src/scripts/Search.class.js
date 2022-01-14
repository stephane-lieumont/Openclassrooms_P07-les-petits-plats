import Filter from './Filter.class'
import Tag from './Tag.class'
import { ReceiptsList } from './Receipt.class'

import { formatString } from './utils'

export default class Search {
  /**
   * @param {ObjectJSON} data
   */
  constructor (data) {
    this._data = data

    this.$searchInput = document.querySelector('#search input')

    // Add classes for search components
    this._tag = new Tag()
    this._receipts = new ReceiptsList(this._data)
    this._filterIngredients = new Filter('Ingrédients', 'ingredients', 'Rechercher un ingrédient', 'blue', this._receipts.ingredients, this._tag)
    this._filterAppliances = new Filter('Appareils', 'appliances', 'Rechercher un appareil', 'green', this._receipts.appliances, this._tag)
    this._filterUstensils = new Filter('Ustensiles', 'ustensils', 'Rechercher un ustensile', 'red', this._receipts.ustensils, this._tag)

    // Bind publics functions to keep context
    this.search = this.search.bind(this)
    this.filtersClose = this.filtersClose.bind(this)
    this.displayResult = this.displayResult.bind(this)
    this.updateFiltersList = this.updateFiltersList.bind(this)

    // Bind private functions to keep context
    this._addTagEvent = this._addTagEvent.bind(this)
    this._removeTagEvent = this._removeTagEvent.bind(this)
  }

  init () {
    // Display Elements inside DOM document
    this._receipts.createHTMLContent()
    this._filterIngredients.createFilterHtml()
    this._filterAppliances.createFilterHtml()
    this._filterUstensils.createFilterHtml()

    this._filterIngredients.ariaControlInit(this._addTagEvent)
    this._filterAppliances.ariaControlInit(this._addTagEvent)
    this._filterUstensils.ariaControlInit(this._addTagEvent)

    // Init Events interface
    this._filterEventInit()
    this._tagEventInit()
    this.$searchInput.addEventListener('input', this.search)
  }

  /**
   * Display result after search Event
   * @param {Receipt[]} listReceipt
   */
  displayResult (listReceipts) {
    this._receipts.createHTMLContent(listReceipts)
    this.updateFiltersList(listReceipts)
    this._tagEventInit()
  }

  search () {
    const inputKeywordsTab = formatString(this.$searchInput.value.replace(/\s+/g, '+')).split('+')
    let result = []

    if (this.$searchInput.value.length >= 3) {
      result = result.concat(this._searchByTitle(inputKeywordsTab, this._receipts.receiptsList)) // keyword full string
      result = result.concat(this._searchByDescription(inputKeywordsTab, this._receipts.receiptsList)) // keyword full string
      result = result.concat(this._searchByAppliance(inputKeywordsTab, this._receipts.receiptsList)) // keyword string one word
      result = result.concat(this._searchByIngredients(inputKeywordsTab, this._receipts.receiptsList)) // keyword string one word
      result = result.concat(this._searchByUstensils(inputKeywordsTab, this._receipts.receiptsList)) // keyword string one word
    } else {
      result = this._receipts.receiptsList
    }
    // ======================================/
    // Search_feature V1
    // ======================================/
    for (const tag of this._tag.listTags) {
      const keyword = [formatString(tag.value)]
      switch (tag.category) {
        case 'ingredients':
          result = this._searchByIngredients(keyword, result)
          break

        case 'appliances':
          result = this._searchByAppliance(keyword, result)
          break

        case 'ustensils':
          result = this._searchByUstensils(keyword, result)
          break
      }
    }

    result = [...new Set(result)]

    this.displayResult(result)
  }

  /**
   * Update filters list items after search event
   * @param {Receipt[]} listReceipts
   */
  updateFiltersList (listReceipts) {
    let listAppliances = []
    let listIngredients = []
    let listUstensils = []
    // ======================================/
    // Search_feature V1
    // ======================================/
    for (const receipt of listReceipts) {
      listAppliances.push(receipt.appliance)
      listIngredients = listIngredients.concat(receipt.ingredients)
      listUstensils = listUstensils.concat(receipt.ustensils)
    }

    listAppliances = [...new Set(listAppliances)]
    listIngredients = [...new Set(listIngredients)]
    listUstensils = [...new Set(listUstensils)]

    this._filterIngredients.updateFilterResultHtml(listIngredients)
    this._filterAppliances.updateFilterResultHtml(listAppliances)
    this._filterUstensils.updateFilterResultHtml(listUstensils)
  }

  /**
   * Close all filters Event
   */
  filtersClose () {
    this._filterIngredients.closeFilter()
    this._filterAppliances.closeFilter()
    this._filterUstensils.closeFilter()
  }

  /**
   * @param {Array} keywords
   * @param {Receipt[]} listReceipts
   * @returns {Receipt[]}
   */
  _searchByTitle (keywords, listReceipts) {
    const result = []
    const keywordsString = keywords.join(' ')
    // ======================================/
    // Search_feature V1
    // ======================================/
    for (const receipt of listReceipts) {
      if (formatString(receipt.name).includes(keywordsString)) {
        result.push(receipt)
      }
    }

    return result
  }

  /**
   * @param {Array} keywords
   * @param {Receipt[]} listReceipts
   * @returns {Receipt[]}
   */
  _searchByDescription (keywords, listReceipts) {
    const result = []
    const keywordsString = keywords.join(' ')
    // ======================================/
    // Search_feature V1
    // ======================================/
    for (const receipt of listReceipts) {
      if (formatString(receipt.description).includes(keywordsString)) {
        result.push(receipt)
      }
    }

    return result
  }

  /**
   * @param {Array} keywords
   * @param {Receipt[]} listReceipts
   * @returns {Receipt[]}
   */
  _searchByIngredients (keywords, listReceipts) {
    const result = []
    // ======================================/
    // Search_feature V1
    // ======================================/
    for (const keyword of keywords) {
      for (const receipt of listReceipts) {
        for (const ingredient of receipt.keywordsIngredients) {
          if (ingredient.includes(keyword) && keyword.length >= 3) {
            result.push(receipt)
          }
        }
      }
    }

    return result
  }

  /**
   * @param {Array} keywords
   * @param {Receipt[]} listReceipts
   * @returns {Receipt[]}
   */
  _searchByAppliance (keywords, listReceipts) {
    const result = []
    const keywordsString = keywords.join(' ')
    // ======================================/
    // Search_feature V1
    // ======================================/
    for (const receipt of listReceipts) {
      if (formatString(receipt.appliance).includes(keywordsString)) {
        result.push(receipt)
      }
    }

    return result
  }

  /**
   * @param {Array} keywords
   * @param {Receipt[]} listReceipts
   * @returns {Receipt[]}
   */
  _searchByUstensils (keywords, listReceipts) {
    const result = []
    // ======================================/
    // Search_feature V1
    // ======================================/
    for (const keyword of keywords) {
      for (const receipt of listReceipts) {
        for (const ingredient of receipt.keywordsUstensils) {
          if (ingredient.includes(keyword) && keyword.length >= 3) {
            result.push(receipt)
          }
        }
      }
    }

    return result
  }

  /**
   * @param {EventListeners} event
   */
  _addTagEvent (event) {
    const $node = this._tag.addTag(event.target)
    $node.addEventListener('click', this._removeTagEvent)

    this.filtersClose()
    this.search()
  }

  /**
   * @param {EventListeners} event
   */
  _removeTagEvent (event) {
    this.filtersClose()
    this._tag.removeTag(event.target)
    this.search()
  }

  /**
   * Ferme tous les filtre et ouvre celui qui est clické
   */
  _filterEventInit () {
    // Expand Filters action
    this._filterIngredients.filterHTMLComponent.addEventListener('click', event => {
      this._filterAppliances.closeFilter()
      this._filterUstensils.closeFilter()
      this._filterIngredients.expandFilter(event)
    })
    this._filterAppliances.filterHTMLComponent.addEventListener('click', event => {
      this._filterIngredients.closeFilter()
      this._filterUstensils.closeFilter()
      this._filterAppliances.expandFilter(event)
    })
    this._filterUstensils.filterHTMLComponent.addEventListener('click', event => {
      this._filterIngredients.closeFilter()
      this._filterAppliances.closeFilter()
      this._filterUstensils.expandFilter(event)
    })

    // Close all filter if click out filters
    document.querySelector('body').addEventListener('click', this.filtersClose)
  }

  /**
   * Init Event Tags
   */
  _tagEventInit () {
    this._filterIngredients.filterHTMLComponent.querySelectorAll('.filter__item').forEach(item => {
      item.addEventListener('click', this._addTagEvent)
    })
    this._filterAppliances.filterHTMLComponent.querySelectorAll('.filter__item').forEach(item => {
      item.addEventListener('click', this._addTagEvent)
    })
    this._filterUstensils.filterHTMLComponent.querySelectorAll('.filter__item').forEach(item => {
      item.addEventListener('click', this._addTagEvent)
    })
  }
}
