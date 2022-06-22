/* eslint-disable no-undef */
// Script Placeholder

function getNutritionInfo (foodEntry) {
  const options = {
    method: 'GET',
    url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/products/search',
    params: {
      query: foodEntry,
      offset: '0',
      number: '1'
    },
    headers: {
      'X-RapidAPI-Key': 'a0f6075bcemshb0edacc93ae58ecp127f32jsn3d2a6437f6b2',
      'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
    }
  }

  axios.request(options).then(function (response) {
    console.log(response.data)
  }).catch(function (error) {
    console.error(error)
  })
}

// Constants
const LOCAL_STORE_KEY = 'state' // Doesn't really matter

function loadState () {
  return localStorage.getItem(LOCAL_STORE_KEY) || { // Return the state in localStorage OR IF NULL return a default state object
    // The default state object, nothing here for now

  }
}

function init () {
  // eslint-disable-next-line no-unused-vars
  const state = loadState()
  $('#addFood').on('click', () => {

  })
  $(function () {
    $('#datepicker').datepicker()
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
  (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {
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

init()
