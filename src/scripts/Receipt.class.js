import clockAsset from '../assets/clock.svg'

export default class Receipt {
  constructor (data) {
    this._id = data.id
    this._name = data.name
    this._description = data.description
    this._appliance = data.appliance
    this._servings = data.servings
    this._time = data.time

    this._ustensils = data.ustensils
    this._ingredients = data.ingredients
  }

  get id () { return this._id }
  get name () { return this._name }
  get description () { return this._description }
  get appliance () { return this._appliance }
  get servings () { return this._servings }
  get time () { return this._time }
  get ingredients () { return this._ingredients }
  get ustensils () { return this._ustensils }

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
