/* eslint-disable space-before-blocks */
import { ReceiptsList } from './Receipt.class'
import Filter from './Filter.class'
import Tag from './Tag.class'
import { formatString } from './utils'

export default class Search {
  /**
   * @param {ObjectJSON} data
   */
  constructor (data) {
    this._data = data
    this.$searchInput = document.querySelector('#search input')

    this._receiptsList = new ReceiptsList()
    this._searchResult = []
    this._filterIngredients = new Filter('Ingrédients', 'Rechercher un ingrédient', 'blue')
    this._filterAppliances = new Filter('Appareils', 'Rechercher un appareil', 'green')
    this._filterUstensils = new Filter('Ustensils', 'Rechercher un ustensile', 'red')

    this._tag = new Tag()

    this.addTag = this.addTag.bind(this)
    this.filtersClose = this.filtersClose.bind(this)
    this.searchBar = this.searchBar.bind(this)
    this.displayResult = this.displayResult.bind(this)
  }

  /**
   * Initialisation Resultats Index.html
   */
  init () {
    // Affiche les recette dans le DOM
    this._receiptsList.createHTMLContent(this._data)

    // Affiche les Filtres
    this._filterIngredients.createFilterHtml(this._receiptsList.ingredients)
    this._filterAppliances.createFilterHtml(this._receiptsList.appliances)
    this._filterUstensils.createFilterHtml(this._receiptsList.ustensils)

    // Evenement des filtres
    this._filterEventInit()

    // Barre de recherche
    this._searchEventInit()
  }

  /**
   * @param {String} input
   */
  searchBar (input) {
    // Créé un tableau de la liste des mots clé
    const keywordsArray = formatString(input.replace(/\s+/g, '+')).split('+')

    // le champ doit avoir au moins 3 caractères
    if (input.length >= 3) {
      // Recherche par categories
      this._searchResult = this.searchByTitle(keywordsArray, this._receiptsList.receiptsList)
      this._searchResult = this._searchResult.concat(this.searchByDescription(keywordsArray, this._receiptsList.receiptsList))
      this._searchResult = this._searchResult.concat(this.searchByAppliance(keywordsArray, this._receiptsList.receiptsList))
      this._searchResult = this._searchResult.concat(this.searchByIngredients(keywordsArray, this._receiptsList.receiptsList))
      this._searchResult = this._searchResult.concat(this.searchByUstensils(keywordsArray, this._receiptsList.receiptsList))

      // Suppression des doublons
      this._searchResult = [...new Set(this._searchResult)]
      this.displayResult(this._searchResult)
    } else {
      // reinitialisation des resultats
      this.displayResult(this._receiptsList.receiptsList)
    }
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

  filtersClose () {
    this._filterIngredients.closeFilter()
    this._filterAppliances.closeFilter()
    this._filterUstensils.closeFilter()
  }

  addTag (event) {
    this.filtersClose()
    this._tag.addTag(event.target)
  }

  /**
   * @param {Receipt[]} listReceipt
   */
  displayResult (listReceipts) {
    this._receiptsList.updateHTMLContent(listReceipts)
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
    // TagEvent
    this._filterIngredients.filterHTMLResult.querySelectorAll('.filter__item').forEach(item => {
      item.addEventListener('click', this.addTag)
    })
    this._filterAppliances.filterHTMLResult.querySelectorAll('.filter__item').forEach(item => {
      item.addEventListener('click', this.addTag)
    })
    this._filterUstensils.filterHTMLResult.querySelectorAll('.filter__item').forEach(item => {
      item.addEventListener('click', this.addTag)
    })

    // Ferme les Filtres si on click sur la page
    document.querySelector('body').addEventListener('click', this.filtersClose)
  }
}
