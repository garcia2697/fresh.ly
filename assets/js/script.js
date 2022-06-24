/* eslint-disable no-undef */
// Script Placeholder

async function getProductInfo (state, foodEntry) {
  // The real API code
  const options = {
    method: 'GET',
    url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/products/search',
    params: {
      query: foodEntry,
      offset: '0',
      number: '5'
    },
    headers: {
      'X-RapidAPI-Key': 'a0f6075bcemshb0edacc93ae58ecp127f32jsn3d2a6437f6b2',
      'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
    }
  }

  await axios.request(options).then(function (response) {
    console.log(response.data)
    const modal = document.getElementById('modal-js-example')
    const startingDay = moment(modal.dataset.startingday)
    resetProductSearchModal(modal, startingDay)
    generateProductSearchList(state, startingDay, response)
    $('#result-mount').attr('hidden', false)
  }).catch(function (error) {
    console.error(error)
    return null
  })
  // temp response so we're not hitting the api on test
  /* response = {
    type: 'product',
    products: [
      {
        id: 876017,
        title: 'Doritos Nacho Cheese Tortilla Chips (3 oz. ea., 24 ct.)',
        image: 'https://spoonacular.com/productImages/876017-312x231.jpeg',
        imageType: 'jpeg'
      },
      {
        id: 1303505,
        title: '(3 Pack) Doritos Tortilla Chips, Nacho Cheese, 9.75 Oz',
        image: 'https://spoonacular.com/productImages/1303505-312x231.jpeg',
        imageType: 'jpeg'
      },
      {
        id: 1524999,
        title: 'Frito-Lay Doritos & Cheetos Mix Snacks Variety Pack, 40 Count',
        image: 'https://spoonacular.com/productImages/1524999-312x231.jpeg',
        imageType: 'jpeg'
      },
      {
        id: 1760477,
        title: 'Frito-Lay Doritos & Cheetos Mix Snacks Variety Pack, 40 Count',
        image: 'https://spoonacular.com/productImages/1760477-312x231.jpeg',
        imageType: 'jpeg'
      },
      {
        id: 1209973,
        title: 'Doritos 3D Crunch Chili Cheese Nacho Flavored Corn Snacks, 6 oz pack of 3',
        image: 'https://spoonacular.com/productImages/1209973-312x231.jpeg',
        imageType: 'jpeg'
      }
    ],
    offset: 0,
    number: 5,
    totalProducts: 565,
    processingTimeMs: 49,
    expires: 1656139919055,
    isStale: false
  } */ // temp response so we're not hitting api on test
}

// Utils
// This function will return the date of the monday ON OR BEFORE the provided date. This gives us an aligned date to build the UI from.
const getAlignedStartDate = (startDate) =>
  Array.from(Array(7).keys())
    .map(dt => startDate.clone().subtract(dt, 'days'))
    .filter((date) => date.format('dddd') === 'Monday')[0]

// This does the same as above but returns the whole week
const getAlignedWeek = (startDate) =>
  Array.from(Array(7).keys())
    .map(dt => getAlignedStartDate(startDate).add(dt, 'days'))

const getDayIndex = (day) => {
  startDate = getAlignedStartDate(day)
  return Array.from(Array(7).keys())
    .filter(dt => startDate.clone().add(dt, 'days').isSame(day, 'days'))[0]
}

function loadDatePage (date) {
  const alignedWeek = getAlignedWeek(date)
  alignedWeek.forEach((day, index) => {
    document.querySelector(`[data-dayNum="${index}"]`).textContent = day.format('dddd MM/DD/YY')
  })
}

// Constants
const LOCAL_STORE_KEY = 'state' // Doesn't really matter

function loadState () {
  const state = JSON.parse(localStorage.getItem(LOCAL_STORE_KEY)) || { // Return the state in localStorage OR IF NULL return a default state object
    trackedProducts: [],
    currentMonday: getAlignedStartDate(moment())
  }
  state.currentMonday = moment(state.currentMonday)
  return state
}
function saveState (state) {
  localStorage.setItem(LOCAL_STORE_KEY, JSON.stringify(state))
}
function addProduct (state, product) {
  state.trackedProducts.push(product)
  refreshViewProducts(state)
  saveState(state)
}

function refreshViewProducts (state) {
  const tableSecondRow = document.getElementById('tableContentRow')
  $('.productElement').remove()
  const clickHandler = (e) => {
    const modal = document.getElementById('modal-productinfo')
    resetProductInfoModal(modal)
    modal.classList.add('is-active')
    const product = JSON.parse(e.target.dataset.product)
    const productName = modal.querySelector('#productName')
    productName.innerHTML = `${product.productName}`
    const productImgLg = modal.querySelector('#productImageLg')
    const productImgSm = modal.querySelector('#productImageSm')
    productImgLg.src = product.productImage
    productImgSm.src = product.productImage
    const options = {
      method: 'GET',
      url: `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/products/${product.productId}`,
      headers: {
        'X-RapidAPI-Key': 'a0f6075bcemshb0edacc93ae58ecp127f32jsn3d2a6437f6b2',
        'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
      }
    }

    axios.request(options).then(function (response) {
      console.log(response)
      const productNutritionPanel = modal.querySelector('#contentWidget')
      productNutritionPanel.innerHTML += response.data.description + '<ul>' + response.data.nutrition.nutrients.map((nutrient) => `<li>${nutrient.name}: ${nutrient.amount}${nutrient.unit}</li>`).join('') + '</ul>'
    }).catch(function (error) {
      console.error(error)
    })
  }
  const monday = getAlignedStartDate(state.currentMonday)
  state.trackedProducts
    .forEach((product) => {
      product.dateRange.forEach((date, isExpiration) => {
        const currentDate = moment(date)
        if (currentDate.isBetween(monday.clone().subtract(1, 'days'), monday.clone().add(7, 'days'), 'day')) {
          const tr = tableSecondRow.querySelector(`[data-daynum*="${getDayIndex(currentDate)}"]`)
          const newProduct = document.createElement('button')
          newProduct.classList = `productElement button ${isExpiration ? 'is-danger' : 'is-info'}`
          newProduct.style = 'width: 100px; height: 35px'
          newProduct.innerHTML = `${isExpiration ? '(Exp)' : ''} ${product.productName.slice(0, 7)}`
          newProduct.dataset.product = JSON.stringify(product)
          newProduct.onclick = clickHandler
          tr.prepend(newProduct)
        }
      })
    })
}
function generateProductSearchList (state, startDay, response) {
  response.data.products.forEach((product) => {
    const elem = document.createElement('div')
    elem.id = 'productCard'
    elem.dataset.id = product.id
    elem.dataset.image = product.image
    elem.className = 'card'
    elem.innerHTML = `
  <div class="card-content">
    <div class="media">
      <div class="media-left">
        <figure class="image is-48x48">
          <img src="${product.image}" alt="Placeholder image">
        </figure>
      </div>
      <div class="media-content">
        <p id="product-title" class="title is-4">${product.title}</p>
        <p>Expiration Date</p>
        <div class="control flex">
            <input id="expDateInput" class="input" type="text" readonly>
            <button id='addItemButton' class="button is-primary">Add Product</button>
        </div>
      </div>
    </div>
    </div>
  </div>
`
    elem.querySelector('#addItemButton').onclick = (e) => {
      const productCard = e.target.closest('#productCard')
      const product = {
        productId: productCard.dataset.id,
        productName: productCard.querySelector('#product-title').textContent,
        productImage: productCard.dataset.image,
        dateRange: productCard.querySelector('#expDateInput').value
          .split(' - ')
          .map((date) => moment(date, 'MM/DD/YYYY'))
      }
      addProduct(state, product)
    }
    $('#results-list').append(elem)
    const addItemButton = elem.querySelector('#expDateInput')

    const picker = new Lightpick({
      field: addItemButton,
      singleDate: false,
      selectForward: true,
      onSelect: function (start, end) {
        let str = ''
        str += start ? start.format('MM/DD/YYYY') + ' - ' : ''
        str += end ? end.format('MM/DD/YYYY') : '...'
        addItemButton.value = str
      }
    })
    picker.setDateRange(startDay.toDate(), null)
  })
}

function resetProductSearchModal (modal, startingDay) {
  modal.querySelector('#results-list').innerHTML = ''
  modal.dataset.startingday = startingDay
}
function resetProductInfoModal (modal) {

}
function generateTableProductRow (state) {
  const week = getAlignedWeek(state.currentMonday)
  const tableSecondRow = document.getElementById('tableContentRow')
  $('.addFoodElement').remove()
  const clickHandler = (e) => {
    const modal = document.getElementById('modal-js-example')
    resetProductSearchModal(modal, e.currentTarget.dataset.startingday)
    modal.classList.add('is-active')
  }
  week.forEach((day, index) => {
    const tr = tableSecondRow.querySelector(`[data-daynum*="${index}"]`)
    const newProduct = document.createElement('button')
    newProduct.dataset.startingday = day.format()
    newProduct.classList = 'addFoodElement button is-info'
    newProduct.style = 'width: 20px; height: 20px'
    newProduct.innerHTML = '+'
    newProduct.onclick = clickHandler
    tr.append(newProduct)
  })
}

function init () {
  // eslint-disable-next-line no-unused-vars
  const state = loadState()
  // Event handlers
  $('#searchProductButton').on('click', () => {
    const productName = $('#productNameInput').val()
    getProductInfo(state, productName)
  })
  $('#nextPageBtn').on('click', () => {
    state.currentMonday.add(1, 'week')
    loadDatePage(state.currentMonday)
    refreshViewProducts(state)
    saveState(state)
  })
  $('#nowPageBtn').on('click', () => {
    state.currentMonday = getAlignedStartDate(moment())
    loadDatePage(state.currentMonday)
    refreshViewProducts(state)
    saveState(state)
  })
  $('#prevPageBtn').on('click', () => {
    state.currentMonday.subtract(1, 'week')
    loadDatePage(state.currentMonday)
    refreshViewProducts(state)
    saveState(state)
  })

  // Setup UI
  loadDatePage(state.currentMonday)
  generateTableProductRow(state)
  refreshViewProducts(state)
}

// Modal stuff
document.addEventListener('DOMContentLoaded', () => {
  // Functions to open and close a modal
  function openModal ($el) {
    $el.classList.add('is-active')
  }

  function closeModal ($el) {
    $el.classList.remove('is-active')
  }

  function closeAllModals () {
    (document.querySelectorAll('.modal') || []).forEach(($modal) => {
      closeModal($modal)
    })
  }

  // Add a click event on buttons to open a specific modal
  (document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
    const modal = $trigger.dataset.target
    const $target = document.getElementById(modal)

    $trigger.addEventListener('click', () => {
      openModal($target)
    })
  });

  // Add a click event on various child elements to close the parent modal
  (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot') || []).forEach(($close) => {
    const $target = $close.closest('.modal')

    $close.addEventListener('click', () => {
      closeModal($target)
    })
  })

  // Add a keyboard event to close all modals
  document.addEventListener('keydown', (event) => {
    const e = event || window.event

    if (e.keyCode === 27) { // Escape key
      closeAllModals()
    }
  })
})

jQuery(init)
