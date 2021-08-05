//
// Async Get Requests boilerplate code

const getData = async () => {
    try {
      const response = await fetch('https://api-to-call.com/endpoint');
      if (response.ok) {
        const jsonResponse = await response.json();
        return jsonResponse;
      }
      throw new Error('Request failed!');
    } catch(error) {
      console.log(error);
    }
}

// Async post request boilerplate
const getData = async () => {
    try {
      const response = await fetch('https://api-to-call.com/endpoint', {
        method: 'POST',
        body: JSON.stringify({id: 200})
      });
      if (response.ok) {
        const jsonResponse = await response.json();
        return jsonResponse;
      }
      throw new Error('Request failed!');
    } catch(error) {
      console.log(error);
    }
}

// Using it in the exercise:
const shortenUrl = async () => {
    const urlToShorten = inputField.value;
    const data = JSON.stringify({destination: urlToShorten});
    try {
        const response = await fetch(url, {
          method: 'POST',
          body: data,
          headers: {
          'Content-type': 'application/json',
          'apikey': apiKey
          }
        });
        if (response.ok) {
          const jsonResponse = await response.json();
          renderResponse(jsonResponse);
        }
    } catch (error) {
        console.log(error);
    }
}