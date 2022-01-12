/**
 * @property {Array} listTags
 */
export default class Tag {
  constructor () {
    this._listTags = []

    // HTML DOM
    this.$wrapperTags = document.querySelector('[data-wrapper="tags"]')

    // Bind private functions to keep context
    this.addTag = this.addTag.bind(this)
    this.removeTag = this.removeTag.bind(this)
  }

  /** GETTERS */
  get listTags () {
    return this._listTags
  }

  /**
   * @param {HTMLElement} target
   * @return {HTMLElement}
   */
  addTag (target) {
    // add Tag Element on TagList
    this._listTags.push({ value: target.innerHTML, category: target.dataset.category })

    // DOM
    const $wrapper = this._createTagHtmlContent(target)
    let $wrapperContainer

    if (!this.$wrapperTags.querySelector('ul')) {
      $wrapperContainer = this._createTagsHtmlContainer()
      this.$wrapperTags.appendChild($wrapperContainer)
    } else {
      $wrapperContainer = this.$wrapperTags.querySelector('ul')
    }

    $wrapperContainer.appendChild($wrapper)

    return $wrapper
  }

  /**
   * @param {HTMLElement} target
   */
  removeTag (target) {
    // Delete Tag Element on TagList
    this._listTags = this._listTags.filter(item => !(item.value === target.innerHTML && item.category === target.dataset.category))

    // DOM
    if (this._listTags.length === 0) {
      this.$wrapperTags.querySelector('ul').remove()
    }
    target.remove()
  }

  /**
   * PRIVATE : Container list Tags
   * @returns {HTMLElement}
   */
  _createTagsHtmlContainer () {
    const $wrapper = document.createElement('ul')
    $wrapper.classList.add('m-0', 'p-0', 'd-flex', 'flex-row', 'flex-wrap')
    $wrapper.id = 'tags__list'

    return $wrapper
  }

  /**
   * PRIVATE : Tag HTML Component
   * @param {HTMLElement} target
   * @returns {HTMLElement}
   */
  _createTagHtmlContent (target) {
    const tagColor = target.dataset.color
    const $wrapper = document.createElement('li')
    $wrapper.classList.add('tags__item', 'mb-2', 'me-2', 'px-3', 'py-2', 'pe-5', 'badge', 'tag', `bg-${tagColor}`, 'd-flex', 'flex-row', 'align-items-center')
    $wrapper.innerHTML = target.innerHTML
    $wrapper.dataset.category = target.dataset.category

    return $wrapper
  }
}
