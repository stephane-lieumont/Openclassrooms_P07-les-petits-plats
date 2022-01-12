import { ReceiptsList } from './Receipt.class'
import Filter from './Filter.class'
import Tag from './Tag.class'
import { formatString } from './utils'

export default class Search {
  /**
   * @param {ObjectJSON} data
   */
  constructor (data) {
    this.$searchInput = document.querySelector('#search input')

    this._data = data

    // Add classes for search components
    this._receipts = new ReceiptsList()
    this._filterIngredients = new Filter('Ingrédients', 'ingredients', 'Rechercher un ingrédient', 'blue')
    this._filterAppliances = new Filter('Appareils', 'appliances', 'Rechercher un appareil', 'green')
    this._filterUstensils = new Filter('Ustensiles', 'ustensils', 'Rechercher un ustensile', 'red')
    this._tag = new Tag()

    // Tab result properties
    this._receiptsList = []
    this._searchTag = []
    this._searchResult = []

    // Bind publics functions to keep context
    this.filtersClose = this.filtersClose.bind(this)
    this.searchBar = this.searchBar.bind(this)
    this.searchTag = this.searchTag.bind(this)
    this.displayResult = this.displayResult.bind(this)
    this.updateFiltersList = this.updateFiltersList.bind(this)

    // Bind private functions to keep context
    this._addTagEvent = this._addTagEvent.bind(this)
    this._removeTagEvent = this._removeTagEvent.bind(this)
  }

  /**
   * Initialisation Resultats Index.html
   */
  init () {
    // Affiche les recette dans le DOM
    this._receipts.createHTMLContent(this._data)

    // Affiche les Filtres
    this._filterIngredients.createFilterHtml(this._receipts.ingredients)
    this._filterAppliances.createFilterHtml(this._receipts.appliances)
    this._filterUstensils.createFilterHtml(this._receipts.ustensils)

    // Evenement des filtres
    this._filterEventInit()
    this._tagEventInit()

    // Barre de recherche
    this._searchEventInit()
  }

  searchTag () {
    const tagSelected = this._tag.listTags
    let result = this._receipts.receiptsList

    if (tagSelected.length === 0) {
      return this._receipts.receiptsList
    }

    for (const tag of tagSelected) {
      const keyword = [formatString(tag.value)]
      switch (tag.category) {
        case 'ingredients':
          result = this.searchByIngredients(keyword, result)
          break

        case 'appliances':
          result = this.searchByAppliance(keyword, result)
          break

        case 'ustensils':
          result = this.searchByUstensils(keyword, result)
          break
      }
    }

    result = [...new Set(result)]
    return result
  }

  /**
   * @param {String} input
   */
  searchBar (input) {
    // Créé un tableau de la liste des mots clé
    const keywordsArray = formatString(input.replace(/\s+/g, '+')).split('+')
    this._searchResult = this.searchTag()

    // le champ doit avoir au moins 3 caractères
    if (input.length >= 3) {
      // Recherche par categories
      this._searchResult = this.searchByTitle(keywordsArray, this._searchResult)
      this._searchResult = this._searchResult.concat(this.searchByDescription(keywordsArray, this._searchResult))
      this._searchResult = this._searchResult.concat(this.searchByAppliance(keywordsArray, this._searchResult))
      this._searchResult = this._searchResult.concat(this.searchByIngredients(keywordsArray, this._searchResult))
      this._searchResult = this._searchResult.concat(this.searchByUstensils(keywordsArray, this._searchResult))

      // Suppression des doublons
      this._searchResult = [...new Set(this._searchResult)]
    }

    this.displayResult(this._searchResult)
  }

  /**
   * @param {Array} keywords
   * @param {Receipt[]} listReceipts
   * @returns {Receipt[]}
   */
  searchByTitle (keywords, listReceipts) {
    const result = []
    const keywordsString = keywords.join(' ')

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
  searchByDescription (keywords, listReceipts) {
    const result = []
    const keywordsString = keywords.join(' ')

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
  searchByIngredients (keywords, listReceipts) {
    const result = []

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
  searchByAppliance (keywords, listReceipts) {
    const result = []
    const keywordsString = keywords.join(' ')

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
  searchByUstensils (keywords, listReceipts) {
    const result = []

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
   * @param {Receipt[]} listReceipt
   */
  displayResult (listReceipts) {
    this._receipts.updateHTMLContent(listReceipts)
    this.updateFiltersList(listReceipts)
    this._tagEventInit()
  }

  updateFiltersList (listReceipts) {
    let listAppliances = []
    let listIngredients = []
    let listUstensils = []

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

  filtersClose () {
    this._filterIngredients.closeFilter()
    this._filterAppliances.closeFilter()
    this._filterUstensils.closeFilter()
  }

  _addTagEvent (event) {
    const $node = this._tag.addTag(event.target)
    $node.addEventListener('click', this._removeTagEvent)

    this.filtersClose()
    this.displayResult(this.searchTag())
  }

  _removeTagEvent (event) {
    this.filtersClose()
    this._tag.removeTag(event.target)
    this.displayResult(this.searchTag())
  }

  _searchEventInit () {
    this.$searchInput.addEventListener('input', (e) => {
      this.searchBar(e.target.value)
    })
  }

  /**
   * PRIVATE Ferme tous les filtre et ouvre celui qui est clické
   */
  _filterEventInit () {
    // Expand Filter
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

    // Ferme les Filtres si on click sur la page
    document.querySelector('body').addEventListener('click', this.filtersClose)
  }

  _tagEventInit () {
    // TagEvent
    this._filterIngredients.filterHTMLResult.querySelectorAll('.filter__item').forEach(item => {
      item.addEventListener('click', this._addTagEvent)
    })
    this._filterAppliances.filterHTMLResult.querySelectorAll('.filter__item').forEach(item => {
      item.addEventListener('click', this._addTagEvent)
    })
    this._filterUstensils.filterHTMLResult.querySelectorAll('.filter__item').forEach(item => {
      item.addEventListener('click', this._addTagEvent)
    })
  }
}
