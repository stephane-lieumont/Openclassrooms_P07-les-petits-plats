// 0 - Creer une class API
// 1- Creer une class Filter
// 2- Creer une class Tags
// 3- Creer une class Recipes

import API from './scripts/Api.class'
import Search from './scripts/Search.class'
import urlData from './mock/receipts.json'

// import Ingredient from './scripts/Ingredient.class'
// import Ustensil from './scripts/Ustensil.class'

async function app () {
  const Api = new API(urlData)
  const data = await Api.getAllReceipts()

  const searchEngine = new Search(data)
  searchEngine.init()
}

app()

/**
 *
 */
//
//
// Toogle example input search filters
/*
$wrapperFilter.querySelectorAll('.filter').forEach(item => {
  item.addEventListener('click', function (e) {
    if (e.target.classList.contains('filter')) {
      e.target.classList.toggle('filter--active')
      if (e.target.classList.contains('filter--active')) {
        e.target.querySelector('input').focus()
      } else {
        e.target.focus()
      }
    }
  })
})

// Remove tag example control
$wrapperTags.querySelectorAll('.tags__item').forEach(item => {
  item.addEventListener('click', function (e) {
    e.target.remove()
  })
})

// add tag example control
document.querySelectorAll('.filter__item').forEach(item => {
  item.addEventListener('click', function (e) {
    const tagColor = e.target.dataset.color
    const tag = document.createElement('li')
    tag.classList.add('tags__item', 'my-2', 'px-3', 'py-2', 'pe-5', 'badge', 'tag', `bg-${tagColor}`, 'd-flex', 'flex-row', 'align-items-center')
    tag.innerHTML = e.target.innerHTML

    $wrapperTags.appendChild(tag)

    tag.addEventListener('click', function (e) {
      e.target.remove()
    })
  })
})

*/
