const url = 'http://127.0.0.1:5000';

async function loadCollections() {
  return fetch(url + '/sets').then(response => response.json().catch(err => {
    console.error(`'${err}' happened loading collections`);
    return {};
  }))
}

async function loadCardsFromCollection(collection, search) {
  const query = (search != null && search !== '') ? '?search=' + search : '';
  return fetch(url + '/sets/' + collection + '/cards' + query).then(response => response.json().catch(err => {
    console.error(`'${err}' happened in load cards from collection ${collection}`);
    return {};
  }))
}

async function loadWishes(search) {
  return fetch(url + '/wishes').then(response => response.json().catch(err => {
    console.error(`'${err}' happened loading wishes`);
    return {};
  }))
}

async function loadWishesThatDontContainCard (cardId) {
  return fetch(url + '/wishes?card_id=' + cardId).then(response => response.json().catch(err => {
    console.error(`'${err}' happened loading wishes`);
    return {};
  }))
}

async function loadCardsFromWish(wish, search) {
  const query = (search != null && search !== '') ? '?search=' + search : '';
  return fetch(url + '/wishes/' + wish + '/cards' + query).then(response => response.json().catch(err => {
    console.error(`'${err}' happened loading wishes`);
    return {};
  }))
}

async function createWish(wish) {
  return fetch(url + '/wishes', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(wish)
  }).then(response => {
    if (!response.ok) {
      showErrorToast(response.json()['message']);
    }
    return response.json();
  })
}

async function putCardInWish(wish, card) {
  return fetch(url + '/wishes/' + wish, {
    method: 'PUT',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(card)
  }).then(response => {
    if (!response.ok) {
      showErrorToast(response.json()['message']);
    }
    return response.json();
  })
}

async function deleteCardFromWish(wish, card) {
  return fetch(url + '/wishes/' + wish + '/card', {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(card)
  }).then(response => {
    if (!response.ok) {
      showErrorToast(response.json()['message']);
    }
    return response.json();
  })
}


