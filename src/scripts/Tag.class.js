export default class Tag {
  constructor () {
    this.$wrapperTags = document.querySelector('[data-wrapper="tags"]')
    this.$listTagsHtml = null

    this._listTags = []

    this.removeTag = this.removeTag.bind(this)
  }

  get listTags () {
    return this._listTags
  }

  /**
   * @param {HTMLElement} target
   */
  addTag (target) {
    // Ajout element tableau objet tag
    this._listTags.push({ value: target.innerHTML, category: target.dataset.category })

    // DOM
    if (!this.$listTagsHtml) {
      this.$wrapperTags.appendChild(this.createTagsListHtml())
    }
    this.$listTagsHtml.appendChild(this.createTagHtml(target))
  }

  /**
   * @param {EventListenerObject} event
   */
  removeTag (event) {
    // Supprime element tableau objet tag
    this._listTags = this._listTags.filter(item => !(item.value === event.target.innerHTML && item.category === event.target.dataset.category))

    // DOM
    if (this._listTags.length === 0) {
      this.$listTagsHtml.remove()
    }
    event.target.remove()
  }

  createTagsListHtml () {
    this.$listTagsHtml = document.createElement('ul')
    this.$listTagsHtml.classList.add('m-0', 'p-0', 'd-flex', 'flex-row', 'flex-wrap')
    this.$listTagsHtml.id = 'tags__list'

    return this.$listTagsHtml
  }

  createTagHtml (target) {
    const tagColor = target.dataset.color
    const tag = document.createElement('li')
    tag.classList.add('tags__item', 'mb-2', 'me-2', 'px-3', 'py-2', 'pe-5', 'badge', 'tag', `bg-${tagColor}`, 'd-flex', 'flex-row', 'align-items-center')
    tag.innerHTML = target.innerHTML
    tag.dataset.category = target.dataset.category
    tag.addEventListener('click', this.removeTag)

    return tag
  }
}
