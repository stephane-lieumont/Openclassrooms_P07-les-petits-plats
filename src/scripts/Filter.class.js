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
   * @param {Tag} tag
   */
  constructor (label, category, placeholder, color, items, tag) {
    this._label = label
    this._category = category
    this._placeholder = placeholder
    this._color = color
    this._items = items
    this._tag = tag

    this.$wrapperFiltersList = document.querySelector('[data-wrapper="filters"]')
    this.$wrapperFilter = null
    this.$wrapperNoResult = this._createNoResultHTML()

    // Bind private functions to keep context
    this.expandFilter = this.expandFilter.bind(this)
    this.openFilter = this.openFilter.bind(this)
    this.ariaControlInit = this.ariaControlInit.bind(this)
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
    this.$wrapperFilter.tabIndex = '0'
    this.$wrapperFilter.ariaLabel = this._placeholder
    this.$wrapperFilter.ariaExpanded = false
    this.$wrapperFilter.setAttribute('role', 'listbox')

    this.$wrapperFilter.innerHTML = `<input tabindex="-1" class="filter__input form-control border-0 bg-${this._color} text-white py-3 px-4" type="text" name="${formatString(this._label)}" aria-label="${this._label}" id="${formatString(this._label)}" placeholder="${this._label}" />`
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

    if (this._items.length === 0) {
      this.$wrapperFilter.classList.add('disabled')
      this.$wrapperFilter.tabIndex = -1
    } else {
      this.$wrapperFilter.classList.remove('disabled')
      this.$wrapperFilter.tabIndex = 0
    }

    const $wrapper = document.createElement('ul')
    $wrapper.classList.add('row', 'filter__result', 'flex-wrap', 'm-0', 'p-3', 'pt-0', 'list-unstyled', 'text-white', 'fs-6')
    $wrapper.setAttribute('role', 'listbox')
    $wrapper.tabIndex = '-1'

    let content = ''
    this._items.forEach(element => {
      content += `<li class="filter__item col-4  col-sm-6 col-md-4" role="option" tabindex="0" aria-label="${element}" data-color="${this._color}" data-category="${this._category}">${element}</li>`
    })

    $wrapper.innerHTML = content

    if (this.$wrapperFilter.querySelector('ul')) this.$wrapperFilter.querySelector('ul').remove()
    this.$wrapperFilter.appendChild($wrapper)
    this.$listItems = Array.from(this.$wrapperFilter.querySelectorAll('.filter__item'))
  }

  /**
   * @param {EventListenerObject} event
   */
  expandFilter (event) {
    event.stopPropagation()
    if (event.target.classList.contains('filter')) {
      if (!this.$wrapperFilter.classList.contains('filter--active')) {
        this.$wrapperFilter.ariaExpanded = true
        this.openFilter()
      } else {
        this.$wrapperFilter.ariaExpanded = false
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
   * Keyboard control for filters
   * @param {Function} callback
   */
  ariaControlInit (callback) {
    let index = 0

    this.$wrapperFilter.addEventListener('keydown', event => {
      if (this.$wrapperFilter.classList.contains('filter--active')) {
        switch (event.key) {
          case 'Tab':
            this.$wrapperFilter.ariaExpanded = false
            this.closeFilter()
            break
          case 'Escape':
            if (document.activeElement === this.$wrapperFilter.querySelector('input')) {
              this.$wrapperFilter.ariaExpanded = false
              this.$wrapperFilter.focus()
              this.closeFilter()
              this.$wrapperFilter.focus()
            } else {
              this.$wrapperFilter.querySelector('input').focus()
              index = -1
            }
            break
          case 'ArrowUp':
            event.preventDefault()
            if (index === -1) {
              index = this.$listItems.length - 1
            }
            this.$listItems[index].focus()
            index--
            break
          case 'ArrowDown':
            event.preventDefault()
            if (index === this.$listItems.length - 1) {
              index = -1
            }
            index++
            this.$listItems[index].focus()
            break
          case 'Enter':
            event.preventDefault()
            if (this.$listItems.includes(document.activeElement)) {
              callback(event)
            }
            break
        }
      } else {
        if (event.key === ' ' || event.key === 'Enter') {
          event.preventDefault()
          index = -1
          this.$wrapperFilter.ariaExpanded = true
          this.openFilter()
          this.$wrapperFilter.querySelector('input').focus()
        }
      }
    })
  }

  /**
   * @param {EventListenerObject} event
   */
  _searchFilter (event) {
    const value = event.target.value
    const result = []
    this.$listItems = []
    // Rend visible les elements qui contiennent une partie de la chaine de caractères
    event.target.parentNode.querySelectorAll('.filter__item').forEach(item => {
      if (formatString(item.innerHTML).includes(formatString(value))) {
        item.style.display = 'block'
        this.$listItems.push(item)
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
