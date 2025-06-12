
async function loadCollections () {
  return fetch('http://127.0.0.1:5000/sets').then(response => response.json().catch(err => {
    console.error(`'${err}' happened loading collections`);
    return {};
  }))
}

async function loadCardsFromCollection (collection, search) {
  return fetch('http://127.0.0.1:5000/sets/' + collection + '/cards').then(response => response.json().catch(err => {
    console.error(`'${err}' happened in load cards from collection ${collection}`);
    return {};
  }))
}

async function loadWishes () {
  return fetch('http://127.0.0.1:5000/wishes').then(response => response.json().catch(err => {
    console.error(`'${err}' happened loading wishes`);
    return {};
  }))
}

async function loadCardsFromWish (wish, search) {
  // do load wish

  return [];
}

async function putCardInWish (card) {
  // insert card

  showSuccessToast('Card adicionado com sucesso!')
}

async function removeCardFromWish (card) {
  // remove card

  showSuccessToast('Card removido com sucesso!');
}


