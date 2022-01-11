import clockAsset from '../assets/clock.svg'
import { formatString } from './utils'

export class ReceiptsList {
  constructor () {
    this.$wrapperReceipts = document.querySelector('[data-wrapper="receipts"]')

    this._receiptsList = []
    this._listIngredients = []
    this._listAppliances = []
    this._listUstensils = []
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
   * @param {ObjectJSON} data
   */
  createHTMLContent (data) {
    this.$listReceipts = this.createHTMLContainer()

    data.forEach(item => {
      // Creation de l'objet recette et initialisation des tableau de données
      const receipt = new Receipt(item)
      this._receiptsList.push(receipt)
      this._listAppliances.push(receipt.appliance)
      this._listUstensils = this._listUstensils.concat(receipt.ustensils)
      this._listIngredients = this._listIngredients.concat(receipt.ingredients)
      this.$listReceipts.append(receipt.createHTMLComponent())
    })

    // suppression des doublons
    this._listAppliances = Array.from(new Set(this._listAppliances))
    this._listUstensils = Array.from(new Set(this._listUstensils))
    this._listIngredients = Array.from(new Set(this._listIngredients))

    // Affichage de la liste des recettes
    this.$wrapperReceipts.append(this.$listReceipts)
  }

  createHTMLContainer () {
    const $node = document.createElement('ul')
    $node.classList.add('row', 'justify-content-start', 'm-0', 'p-0', 'list-unstyled')

    return $node
  }

  /**
   * @param {Receipt[]} array
   */
  updateHTMLContent (listReceipts) {
    this.$listReceipts.remove()

    if (listReceipts.length > 0) {
      this.$listReceipts = this.createHTMLContainer()
      listReceipts.forEach(item => {
        this.$listReceipts.append(item.createHTMLComponent())
      })
    } else {
      this.$listReceipts.innerHTML = '<p class="m-3 text-secondary">Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson », etc.</p>'
    }

    this.$wrapperReceipts.append(this.$listReceipts)
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
  get name () { return this._name }
  get appliance () { return this._appliance }
  get ustensils () { return this._ustensils }
  get description () { return this._description }

  get keywordsIngredients () {
    return formatString(this.ingredients.join('+')).split('+')
  }

  get keywordsUstensils () {
    return formatString(this._ustensils.join('+')).split('+')
  }

  get ingredients () { // retourne seulement un tableau d'ingrédients
    const lisIngredients = []
    this._ingredients.forEach(item => {
      lisIngredients.push(item.ingredient)
    })

    return lisIngredients
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
