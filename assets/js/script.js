/* eslint-disable no-undef */
// Script Placeholder

function nutritionApiTest () {
  const options = {
    method: 'GET',
    url: 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/products/search',
    params: {
      query: 'Cool Ranch Doritos',
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
nutritionApiTest()
