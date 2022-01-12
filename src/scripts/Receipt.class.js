import clockAsset from '../assets/clock.svg'
import { formatString } from './utils'

export class ReceiptsList {
  constructor (data) {
    this._data = data

    this.$wrapperReceipts = document.querySelector('[data-wrapper="receipts"]')

    this._receiptsList = []
    this._listIngredients = []
    this._listAppliances = []
    this._listUstensils = []

    this._initReceiptsObjects()
  }

  /** GETTERS */
  get receiptsList () {
    return this._receiptsList
  }

  get ingredients () {
    return this._listIngredients
  }

  get appliances () {
    return this._listAppliances
  }

  get ustensils () {
    return this._listUstensils
  }

  /**
   * @param {Receipt[]} arrayReceipts
   */
  createHTMLContent (arrayReceipts = this._receiptsList) {
    if (this.$wrapperReceipts.querySelector('#result')) this.$wrapperReceipts.querySelector('#result').remove()

    if (arrayReceipts.length === 0) {
      this.$wrapperReceipts.innerHTML = '<p id="result" class="m-4 text-secondary">Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.</p>'
    } else {
      const $wrapper = this.createHTMLContainer()
      arrayReceipts.forEach(receipt => $wrapper.append(receipt.createHTMLComponent()))
      this.$wrapperReceipts.append($wrapper)
    }
  }

  /**
   * @returns {HTMLElement}
   */
  createHTMLContainer () {
    const $node = document.createElement('ul')
    $node.classList.add('row', 'justify-content-start', 'm-0', 'p-0', 'list-unstyled')
    $node.id = 'result'

    return $node
  }

  _initReceiptsObjects () {
    this._data.forEach(item => {
      const receipt = new Receipt(item)
      this._receiptsList.push(receipt)
      this._listAppliances.push(receipt.appliance)
      this._listUstensils = this._listUstensils.concat(receipt.ustensils)
      this._listIngredients = this._listIngredients.concat(receipt.ingredients)
    })

    // suppression des doublons
    this._listAppliances = [...new Set(this._listAppliances)]
    this._listUstensils = [...new Set(this._listUstensils)]
    this._listIngredients = [...new Set(this._listIngredients)]
  }
}

export class Receipt {
  /**
   * @param {ObjectJSON} itemData
   */
  constructor (itemData) {
    this._id = itemData.id
    this._name = itemData.name
    this._servings = itemData.servings
    this._time = itemData.time

    this._description = itemData.description
    this._ustensils = itemData.ustensils
    this._ingredients = itemData.ingredients
    this._appliance = itemData.appliance
  }

  /* GETTERS */
  get name () {
    return this._name
  }

  get appliance () {
    return this._appliance
  }

  get ustensils () {
    return this._ustensils
  }

  get description () {
    return this._description
  }

  /**
   * @return {Array} with strings ingredients
   */
  get ingredients () {
    const lisIngredients = []
    this._ingredients.forEach(item => {
      lisIngredients.push(item.ingredient)
    })

    return lisIngredients
  }

  /**
   * @return {String} format string for keywords research
   */
  get keywordsIngredients () {
    return formatString(this.ingredients.join('+')).split('+')
  }

  /**
   * @return {String} format string for keywords research
   */
  get keywordsUstensils () {
    return formatString(this._ustensils.join('+')).split('+')
  }

  /**
   * @returns {HTMLElement}
   */
  createHTMLComponent () {
    const $wrapper = document.createElement('li')
    $wrapper.classList.add('col-xl-4', 'col-md-6', 'col-sm-12', 'box', 'px-4', 'p-0', 'mb-5')

    const content = `
      <article class="card border-0 bg-light">
        <div class="card-img-top"></div>
        <div class="card-body">
          <div class="d-flex flex-row mt-2 mb-4 justify-content-between gap-2 ">
            <h2 class="card-title col">${this._name}</h2>
            <div class="col-4 d-flex flex-row align-items-center justify-content-end">
              <svg class="me-2" width="20" height="20">
                <use xlink:href="${clockAsset}#clock"/>
              </svg>
              <p class="card-subtitle">${this._time} min</p>
            </div>
          </div>
          <div class="ingredients d-flex flex-row justify-content-between gap-2">
            <p class="card-text col-6 m-0">${this._description}</p>
          </div>
        </div>
      </article>
    `

    $wrapper.innerHTML = content
    $wrapper.querySelector('.ingredients').prepend(this._createHTMLIngredients())

    return $wrapper
  }

  /**
   * @returns {HTMLElement}
   */
  _createHTMLIngredients () {
    const $wrapper = document.createElement('ul')
    $wrapper.classList.add('col-6')

    let content = ''

    this._ingredients.forEach(item => {
      content += `<li><strong>${item.ingredient} ${item.quantity || item.unit ? ':' : ''}</strong> ${item.quantity ? item.quantity : ''} ${item.unit ? item.unit : ''}</li>`
    })

    $wrapper.innerHTML = content

    return $wrapper
  }
}
