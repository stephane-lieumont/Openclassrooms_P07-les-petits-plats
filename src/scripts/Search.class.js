/* eslint-disable space-before-blocks */
import Filter from './Filter.class'
import ReceiptsList from './Receipt.class'
import Tag from './Tag.class'

export default class Search {
  /**
   * @param {ObjectJSON} data
   */
  constructor (data) {
    this._data = data

    this._receiptsList = new ReceiptsList()
    this._filterIngredients = new Filter('Ingrédients', 'Rechercher un ingrédient', 'blue')
    this._filterAppliances = new Filter('Appareils', 'Rechercher un appareil', 'green')
    this._filterUstensils = new Filter('Ustensils', 'Rechercher un ustensile', 'red')

    this._tag = new Tag()

    this._addTag = this._addTag.bind(this)
    this._filtersClose = this._filtersClose.bind(this)
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
      item.addEventListener('click', this._addTag)
    })
    this._filterAppliances.filterHTMLResult.querySelectorAll('.filter__item').forEach(item => {
      item.addEventListener('click', this._addTag)
    })
    this._filterUstensils.filterHTMLResult.querySelectorAll('.filter__item').forEach(item => {
      item.addEventListener('click', this._addTag)
    })

    // Ferme les Filtres si on click sur la page
    document.querySelector('body').addEventListener('click', this._filtersClose)
  }

  /**
   * PRIVATE Ferme tous les filtresé
   */
  _filtersClose () {
    this._filterIngredients.closeFilter()
    this._filterAppliances.closeFilter()
    this._filterUstensils.closeFilter()
  }

  _addTag (event) {
    this._filtersClose()
    this._tag.addTag(event.target)
  }
}
