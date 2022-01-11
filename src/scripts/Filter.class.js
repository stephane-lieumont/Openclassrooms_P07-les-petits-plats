import { formatString } from './utils'

export default class Filter {
  /**
   * @param {String} label
   * @param {String} placeholder
   * @param {String} color
   */
  constructor (label, placeholder, color) {
    this.$wrapperFiltersList = document.querySelector('[data-wrapper="filters"]')
    this.$wrapperResultList = null
    this.$wrapperFilter = null

    this.$wrapperNoResult = document.createElement('li')
    this.$wrapperNoResult.classList.add('no-result')
    this.$wrapperNoResult.innerHTML = 'Aucun Résultats'

    this._label = label
    this._placeholder = placeholder
    this._color = color
    this._filterList = []

    // Conserve le context du Filter
    this.expandFilter = this.expandFilter.bind(this)
    this.openFilter = this.openFilter.bind(this)
    this.closeFilter = this.closeFilter.bind(this)
    this._searchFilter = this._searchFilter.bind(this)
  }

  /** GETTERS */
  get filterHTMLComponent () {
    return this.$wrapperFilter
  }

  get filterHTMLResult () {
    return this.$wrapperResultList
  }

  /**
   * @param {Array} array
   */
  createFilterHtml (array) {
    this._filterList = array

    this.$wrapperFilter = document.createElement('div')
    this.$wrapperFilter.classList.add('filter', `bg-${this._color}`, 'rounded', 'p-0', 'me-3', 'col-auto')
    this.$wrapperFilter.dataset.label = this._label
    this.$wrapperFilter.dataset.placeholder = this._placeholder

    this.$wrapperFilter.innerHTML = `<input class="filter__input form-control border-0 bg-${this._color} text-white py-3 px-4" type="text" name="${formatString(this._label)}" id="${formatString(this._label)}" placeholder="${this._label}" />`

    this.$wrapperFilter.querySelector('input').addEventListener('input', this._searchFilter)
    this.$wrapperFilter.appendChild(this._createFilterResultHtml())

    this.$wrapperFiltersList.appendChild(this.$wrapperFilter)
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
      this.$wrapperResultList.querySelectorAll('.filter__item').forEach(item => {
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
      this.$wrapperResultList.appendChild(this.$wrapperNoResult)
    } else if (this.$wrapperNoResult) {
      this.$wrapperNoResult.remove()
    }
  }

  _createFilterResultHtml () {
    this.$wrapperResultList = document.createElement('ul')
    this.$wrapperResultList.classList.add('row', 'filter__result', 'flex-wrap', 'm-0', 'p-3', 'pt-0', 'list-unstyled', 'text-white', 'fs-6')

    let content = ''
    this._filterList.forEach(element => {
      content += `<li class="filter__item col-sm-6 col-md-4" data-color="${this._color}" data-category="${formatString(this._label)}">${element}</li>`
    })

    this.$wrapperResultList.innerHTML = content

    return this.$wrapperResultList
  }
}
