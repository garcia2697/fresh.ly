/* eslint-disable no-undef */
// Script Placeholder

async function getNutritionInfo (foodEntry) {
  /* const options = {
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
    $('#results-list').html(generateProductList(response.data))
    $('#result-mount').attr('hidden', false)
  }).catch(function (error) {
    console.error(error)
    return null
  }) */
  response = {
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
  } // temp response so we're not hitting api on test
  $('#results-list').html(generateProductList(response))
  $('#result-mount').attr('hidden', false)
}

// Constants
const LOCAL_STORE_KEY = 'state' // Doesn't really matter

function loadState () {
  return localStorage.getItem(LOCAL_STORE_KEY) || { // Return the state in localStorage OR IF NULL return a default state object
    // The default state object, nothing here for now

  }
}

function generateProductList (response) {
  //`<li><img src="${product.image}"></img><a>${product.title}</a></li>`
  return response.products.map((product) => `<div class="card">
  <div class="card-content">
    <div class="media">
      <div class="media-left">
        <figure class="image is-48x48">
          <img src="${product.image}" alt="Placeholder image">
        </figure>
      </div>
      <div class="media-content">
        <p class="title is-4">${product.title}</p>
        <button id='addItemButton' class="button is-normal">Add Product</button>
      </div>
    </div>
    </div>
  </div>
</div>`)
}

function init () {
  // eslint-disable-next-line no-unused-vars
  const state = loadState()
  $('#searchProductButton').on('click', () => {
    const productName = $('#productNameInput').val()
    console.log(`Doing search for ${productName}`)
    getNutritionInfo(productName)
  })
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
