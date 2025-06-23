async function loadCollections() {
  return fetch('http://127.0.0.1:5000/sets').then(response => response.json().catch(err => {
    console.error(`'${err}' happened loading collections`);
    return {};
  }))
}

async function loadCardsFromCollection(collection, search) {
  return fetch('http://127.0.0.1:5000/sets/' + collection + '/cards').then(response => response.json().catch(err => {
    console.error(`'${err}' happened in load cards from collection ${collection}`);
    return {};
  }))
}

async function loadWishes(search) {
  return fetch('http://127.0.0.1:5000/wishes').then(response => response.json().catch(err => {
    console.error(`'${err}' happened loading wishes`);
    return {};
  }))
}

async function loadWishesThatDontContainCard (cardId) {
  return fetch('http://127.0.0.1:5000/wishes?card_id=' + cardId).then(response => response.json().catch(err => {
    console.error(`'${err}' happened loading wishes`);
    return {};
  }))
}

async function loadCardsFromWish(wish, search) {
  return fetch('http://127.0.0.1:5000/wishes/' + wish + '/cards').then(response => response.json().catch(err => {
    console.error(`'${err}' happened loading wishes`);
    return {};
  }))
}

async function createWish(wish) {
  return fetch('http://127.0.0.1:5000/wishes', {
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
  return fetch('http://127.0.0.1:5000/wishes/' + wish, {
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
  return fetch('http://127.0.0.1:5000/wishes/' + wish + '/card', {
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


