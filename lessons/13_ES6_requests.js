//
// boilerplate code for GET request
//
//
fetch('https://api-to-call.com/endpoint')
.then((response) => {
if(response.ok) {
    return response.json();
  }
    throw new Error('Request failed!');
}, (networkError) => {
    console.log(networkError.message);
})
.then((jsonResponse) =>{
    return jsonResponse;
})

//
// Exercise
//

// Information to reach API
const url = 'https://api.datamuse.com/words';
const queryParams = '?sl=';

// Selects page elements
const inputField = document.querySelector('#input');
const submit = document.querySelector('#submit');
const responseField = document.querySelector('#responseField');

// AJAX function
const getSuggestions = () => {
  const wordQuery = inputField.value;
  const endpoint = `${url}${queryParams}${wordQuery}`;
  
  fetch(endpoint, {cache: 'no-cache'}).then(response => {
    if (response.ok) {
      return response.json();
    }
    throw new Error('Request failed!');
  }, networkError => {
    console.log(networkError.message)
  })
  .then((jsonResponse) => {
    renderResponse(jsonResponse);
  })
}

//
// Boilerplate for Post with fetch.
// Slightly different approach from the official documentation at
// https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch


fetch('https://api-to-call.com/endpoint', {
    method: 'POST',
    body: JSON.stringify({id: '200'})
})
.then((response) => {
    if (response.ok) {
        return response.json();
    }
    throw new Error('Request failed!');
}, (networkError) => {
    console.log(networkError.message);
})
.then((jsonResponse) => {
    return jsonResponse;
})

