'use strict';

const API_KEY = 'eKaZiQdPta2MTJd3Pberdv0KhsaAI0pwyqVHiYE3';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
  const queryItems = Object.keys(params).map(
    key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
  );
  return queryItems.join('&');
}
function displayResults(responseJson) {
  console.log(responseJson);
  $('#results-list').empty();
  let html = '';
  for (let i = 0; i < responseJson.data.length; i++) {
    const park = responseJson.data[i];
    const description = park.description;
    const name = park.name;
    const url = park.url;
    const address = park.directionsInfo;

    html += `
        <li><h3>${name}</h3>
          <p>Description: ${description}</p>
          <p>URL : <a href="${url}">${url}</a></p>
          <p>Address: ${address}</p>
        </li>`;
  }

  $('#results-list').html(html);
  $('#results').removeClass('hidden');
}

function getParkResults(query, maxResults = 10) {
  maxResults -= 1;
  // let stateCodeString = ''
  // // check if the query have comma inside
  // if (query.indexOf(',') > -1) {
  //   // if it has comma, create a string for state code
  //   let stateArray = query.split(",")
  //   //  console.log(stateArray);
  //   for (let i = 0; i < stateArray.length; i++) {
  //     console.log(stateArray[i]);
  //     stateCodeString += `stateCode=${stateArray[i]}&`
  //   }
  // }

  // // if not, use as it is
  // else {
  //   stateCodeString = `stateCode=${query}&`
  // }

  const params = {
    api_key: API_KEY,
    limit: maxResults,
    q: query
  };

  const queryString = formatQueryParams(params);
  // const url = searchURL + '?' + queryString + '&' + stateCodeString;
  const url = searchURL + '?' + queryString 
  console.log(url);


  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function watchForm() {
  $('.user-form').submit(function (event) {
    event.preventDefault();
    const state = $(this)
      .find('#state')
      .val();
    const maxResults = $(this)
      .find('#max')
      .val();
    console.log(state, maxResults)
    getParkResults(state, maxResults);
  });
}

$(watchForm);