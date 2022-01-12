import { formatString } from './utils'

/**
 * @property {HTMLElement} filterHTMLComponent
 */
export default class Filter {
  /**
   * @param {String} label
   * @param {String} category
   * @param {String} placeholder
   * @param {String} color
   * @param {Array} items list items injected on advanced filter
   */
  constructor (label, category, placeholder, color, items) {
    this._label = label
    this._category = category
    this._placeholder = placeholder
    this._color = color
    this._items = items

    this.$wrapperFiltersList = document.querySelector('[data-wrapper="filters"]')
    this.$wrapperFilter = null
    this.$wrapperNoResult = this._createNoResultHTML()

    // Bind private functions to keep context
    this.expandFilter = this.expandFilter.bind(this)
    this.openFilter = this.openFilter.bind(this)
    this.closeFilter = this.closeFilter.bind(this)
    this._searchFilter = this._searchFilter.bind(this)
  }

  /** GETTERS */
  get filterHTMLComponent () {
    return this.$wrapperFilter
  }

  createFilterHtml () {
    this.$wrapperFilter = document.createElement('div')
    this.$wrapperFilter.classList.add('filter', `bg-${this._color}`, 'rounded', 'p-0', 'me-3', 'col-auto')
    this.$wrapperFilter.dataset.label = this._label
    this.$wrapperFilter.dataset.placeholder = this._placeholder
    this.$wrapperFilter.innerHTML = `<input class="filter__input form-control border-0 bg-${this._color} text-white py-3 px-4" type="text" name="${formatString(this._label)}" id="${formatString(this._label)}" placeholder="${this._label}" />`
    this.updateFilterResultHtml(this._items)

    this.$wrapperFilter.querySelector('input').addEventListener('input', this._searchFilter)

    this.$wrapperFiltersList.appendChild(this.$wrapperFilter)
  }

  /**
   * @param {Array} items
   * @returns {HTMLElement}
   */
  updateFilterResultHtml (items) {
    this._items = items

    const $wrapper = document.createElement('ul')
    $wrapper.classList.add('row', 'filter__result', 'flex-wrap', 'm-0', 'p-3', 'pt-0', 'list-unstyled', 'text-white', 'fs-6')

    let content = ''
    this._items.forEach(element => {
      content += `<li class="filter__item col-sm-6 col-md-4" data-color="${this._color}" data-category="${this._category}">${element}</li>`
    })

    $wrapper.innerHTML = content

    if (this.$wrapperFilter.querySelector('ul')) this.$wrapperFilter.querySelector('ul').remove()
    this.$wrapperFilter.appendChild($wrapper)
  }

  /**
   * @param {EventListenerObject} event
   */
  expandFilter (event) {
    event.stopPropagation()
    if (event.target.classList.contains('filter')) {
      if (!this.$wrapperFilter.classList.contains('filter--active')) {
        this.openFilter()
      } else {
        this.closeFilter()
      }
    }
  }

  openFilter () {
    this.$wrapperFilter.classList.add('filter--active')
    this.$wrapperFilter.querySelector('input').placeholder = this._placeholder
  }

  closeFilter () {
    if (this.$wrapperFilter.classList.contains('filter--active')) {
      this.$wrapperFilter.classList.remove('filter--active')
      this.$wrapperFilter.querySelector('input').placeholder = this._label
      this.$wrapperFilter.querySelector('input').value = ''

      // reinit la list des resultats
      this.$wrapperFilter.querySelectorAll('.filter__item').forEach(item => {
        item.style.display = 'block'
      })
      this.$wrapperNoResult.remove()
    }
  }

  /**
   * @param {EventListenerObject} event
   */
  _searchFilter (event) {
    const value = event.target.value
    const result = []
    // Rend visible les elements qui contiennent une partie de la chaine de caractères
    event.target.parentNode.querySelectorAll('.filter__item').forEach(item => {
      if (formatString(item.innerHTML).includes(formatString(value))) {
        item.style.display = 'block'
        result.push(item)
      } else {
        item.style.display = 'none'
      }
    })

    if (result.length === 0) {
      this.$wrapperFilter.appendChild(this.$wrapperNoResult)
    } else if (this.$wrapperNoResult) {
      this.$wrapperNoResult.remove()
    }
  }

  /**
   * @returns {HTMLElement}
   */
  _createNoResultHTML () {
    const $node = document.createElement('p')
    $node.classList.add('filter__result', 'no-result', 'm-0', 'p-3', 'pt-0', 'text-white', 'fs-6')
    $node.innerHTML = 'Aucun résultat'

    return $node
  }
}
