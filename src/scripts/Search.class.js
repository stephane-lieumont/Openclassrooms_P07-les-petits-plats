/* eslint-disable space-before-blocks */
import Receipt from './Receipt.class'

export default class Search {
  constructor (data) {
    this._data = data

    this._receiptsList = []
    this._ingredientsList = []
    this._appliancesList = []
    this._ustensilsList = []
    this._listTags = []

    this.$wrapperReceipts = document.querySelector('[data-wrapper="receipts"]')
    this.$wrapperFilterIngredients = document.querySelector('[data-wrapper="filter-ingredients"]')
    this.$wrapperFilterAppliances = document.querySelector('[data-wrapper="filter-appliances"]')
    this.$wrapperFilterUstensils = document.querySelector('[data-wrapper="filter-ustensils"]')
    this.$wrapperTags = document.querySelector('[data-wrapper="tags"]')

    this.$listReceipts = null
    this.$listIngredients = null
    this.$listAppliances = null
    this.$listUstensils = null
    this.$listTags = null

    this.expandFilter = this.expandFilter.bind(this)
    this.searchFilter = this.searchFilter.bind(this)
    this.createTagHtml = this.createTagHtml.bind(this)
  }

  /**
   * Initialisation Resultats Index.html
   */
  init () {
    this._initArraysData()
    this.$wrapperReceipts.appendChild(this.createResultReceiptstHtml(this._receiptsList))

    this.$wrapperFilterIngredients.addEventListener('click', this.expandFilter)
    this.$wrapperFilterAppliances.addEventListener('click', this.expandFilter)
    this.$wrapperFilterUstensils.addEventListener('click', this.expandFilter)

    this.$wrapperFilterIngredients.querySelector('input').addEventListener('input', this.searchFilter)
    this.$wrapperFilterAppliances.querySelector('input').addEventListener('input', this.searchFilter)
    this.$wrapperFilterUstensils.querySelector('input').addEventListener('input', this.searchFilter)
  }

  /**
   * Génère le contenus du resultat en HTML
   * @param {Array} receiptsList[]
   * @returns {HTMLElement}
   */
  createResultReceiptstHtml (receiptsList) {
    this.$listReceipts = document.createElement('ul')
    this.$listReceipts.classList.add('row', 'justify-content-start', 'm-0', 'p-0', 'list-unstyled')

    receiptsList.forEach(element => {
      this.$listReceipts.appendChild(element.createHTMLComponent())
    })

    this.$wrapperReceipts.appendChild(this.$listReceipts)

    return this.$listReceipts
  }

  /**
   * Génère le contenus des filtres en HTML
   * @param {Array} array
   * @param {String} category
   * @param {String} colorTag
   */
  createFilterListHtml (array, category) {
    const $node = document.createElement('ul')
    $node.classList.add('row', 'filter__result', 'flex-wrap', 'm-0', 'p-3', 'pt-0', 'list-unstyled', 'text-white', 'fs-6')
    $node.dataset.category = category

    let color

    // recherche de tag dans le tableau (ne pas afficher) et definition de l'attribut data-color
    switch (category) {
      case 'ingredients':
        color = 'blue'
        break
      case 'appliances':
        color = 'green'
        break
      case 'ustensils':
        color = 'red'
        break
      default:
        color = 'none'
        break
    }

    let content = ''
    array.forEach(element => {
      content += `<li class="filter__item col-sm-6 col-md-4" data-color="${color}">${element}</li>`
    })

    $node.innerHTML = content
    $node.querySelectorAll('li').forEach(item => {
      item.addEventListener('click', this.createTagHtml)
    })

    return $node
  }

  /**
   * Génère le contenu des tags
   * @returns {HTMLElement}
   */
  createTagsListHtml () {
    this.$listTags = document.createElement('ul')
    this.$listTags.classList.add('m-0', 'p-0', 'd-flex', 'flex-row', 'flex-wrap')
    this.$listTags.id = 'tags__list'

    return this.$listTags
  }

  /**
   * Génère le contenu d'un tags
   * @param {EventListener} event
   * @returns {HTMLElement}
   */
  createTagHtml (event) {
    const category = event.target.parentNode.dataset.category

    // si la liste est videohn creer le container
    if (this._listTags.length === 0) {
      this.$wrapperTags.append(this.createTagsListHtml())
    }

    const tagColor = event.target.dataset.color
    const tag = document.createElement('li')
    tag.classList.add('tags__item', 'mb-2', 'me-2', 'px-3', 'py-2', 'pe-5', 'badge', 'tag', `bg-${tagColor}`, 'd-flex', 'flex-row', 'align-items-center')
    tag.innerHTML = event.target.innerHTML
    tag.dataset.category = category

    // Ajout du tag dans le DOM
    this.$listTags.appendChild(tag)

    // Ajout du tag dans le tableau
    this._listTags.push({ value: tag.innerHTML, category: category })

    // Listener pour la suppression du tag
    tag.addEventListener('click', e => {
      // supprime le tag du tableau tag
      this._listTags = this._listTags.filter(item => !(item.value === e.target.innerHTML && item.category === e.target.dataset.category))
      // si la liste est vide on supprime le container
      if (this._listTags.length === 0) {
        this.$listTags.remove()
      }
      e.target.remove()
    })

    return tag
  }

  /**
   * Génère le contenu de la list des tags une fois le bouton déployé
   * @param {EventListener} event
   */
  expandFilter (event) {
    const wrapperTarget = event.target.dataset.wrapper

    if (event.target.classList.contains('filter')){
      if (!event.target.classList.contains('filter--active')) {
        // init de tous les filtres
        this._initFilter(this.$wrapperFilterIngredients, this.$listIngredients)
        this._initFilter(this.$wrapperFilterAppliances, this.$listAppliances)
        this._initFilter(this.$wrapperFilterUstensils, this.$listUstensils)

        // expand menu + focus input
        event.target.classList.add('filter--active')
        event.target.querySelector('input').placeholder = event.target.dataset.placeholder

        // creer la list des elements
        switch (wrapperTarget) {
          case 'filter-ingredients':
            this.$listIngredients = this.createFilterListHtml(this._ingredientsList, 'ingredients')
            this.$wrapperFilterIngredients.appendChild(this.$listIngredients)
            break
          case 'filter-appliances':
            this.$listAppliances = this.createFilterListHtml(this._appliancesList, 'appliances')
            this.$wrapperFilterAppliances.appendChild(this.$listAppliances)
            break
          case 'filter-ustensils':
            this.$listUstensils = this.createFilterListHtml(this._ustensilsList, 'ustensils')
            this.$wrapperFilterUstensils.appendChild(this.$listUstensils)
            break
        }
      } else {
        // supprimme la list des elements
        switch (wrapperTarget) {
          case 'filter-ingredients':
            this.$listIngredients.remove()
            this.$wrapperFilterIngredients.classList.remove('filter--active')
            this.$wrapperFilterIngredients.querySelector('input').value = ''
            this.$listIngredients = null
            break
          case 'filter-appliances':
            this.$listAppliances.remove()
            this.$wrapperFilterAppliances.classList.remove('filter--active')
            this.$wrapperFilterAppliances.querySelector('input').value = ''
            this.$listAppliances = null
            break
          case 'filter-ustensils':
            this.$listUstensils.remove()
            this.$wrapperFilterUstensils.classList.remove('filter--active')
            this.$wrapperFilterUstensils.querySelector('input').value = ''
            this.$listUstensils = null
            break
        }
        // focus element parent
        event.target.querySelector('input').placeholder = event.target.dataset.label
        event.target.focus()
      }
    }
  }

  searchFilter (event) {
    const value = event.target.value

    // Rend visible les element qui contienent une partie de la chaine de caractères
    event.target.parentNode.querySelectorAll('.filter__item').forEach(item => {
      this._formatString(item.innerHTML).includes(this._formatString(value.toLowerCase())) ? item.style.display = 'block' : item.style.display = 'none'
    })
  }

  /**
  * PRIVATE: initialiser le filtre en supprimant la list de tags
  */
  _initFilter (node, listItem) {
    node.classList.remove('filter--active')
    node.querySelector('input').value = ''
    node.querySelector('input').placeholder = this.$wrapperFilterUstensils.dataset.label
    if (listItem) {
      listItem.remove()
    }
  }

  /**
   * PRIVATE: initialiser les tableaux de la class Search
   */
  _initArraysData () {
    this._data.forEach(element => {
      // Creer une nouvelle recette
      this._receiptsList.push(new Receipt(element))
      // Alimente le tableau des appareils
      this._appliancesList.push(element.appliance)
      // Alimente le tableau des ingrédients
      element.ingredients.forEach(item => {
        this._ingredientsList.push(item.ingredient)
      })
      // Alimente le tableau des ustensiles
      element.ustensils.forEach(item => {
        this._ustensilsList.push(item)
      })
    })

    this._appliancesList = this._unique(this._appliancesList)
    this._ingredientsList = this._unique(this._ingredientsList)
    this._ustensilsList = this._unique(this._ustensilsList)
  }

  /**
   * PRIVATE: Supprime les doublons du tableau
   * @param {Array} array
   * @returns {Array}
   */
  _unique (array) {
    return Array.from(new Set(array))
  }

  /**
   * Supprime les accent et rend la chaine de caractère ne minuscule
   * @param {String} string
   * @returns {String}
   */
  _formatString (string) {
    let formatString = string.toLowerCase()
    formatString = formatString.replace(/[éèêë]/g, 'e')
    formatString = formatString.replace(/[àâ]/g, 'a')
    formatString = formatString.replace(/[ùû]/g, 'u')
    formatString = formatString.replace(/[îï]/g, 'i')

    return formatString
  }
}
