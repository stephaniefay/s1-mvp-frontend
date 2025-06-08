// aux functions, to control generic DOM
window.addEventListener('load', function () {
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme != null) {
    changeTheme(currentTheme);
  }

  loadCollectionIndexes();

  document.getElementById("content").classList.remove('invisible');
  document.getElementById("themeSelector").classList.remove('invisible');
  document.getElementById("navbar").classList.remove('invisible');
});

function changeTheme(theme) {
  const themeDOM = document.getElementById("theme");

  switch (theme) {
    case 'light':
      themeDOM.href = 'css/bootstrap-minty.css';
      localStorage.setItem('theme', theme);
      document.getElementById("theme-selected").src = 'img/sun.svg';
      break;
    case 'dark':
      themeDOM.href = 'css/bootstrap-slate.css';
      localStorage.setItem('theme', theme);
      document.getElementById("theme-selected").src = 'img/moon.svg';
      break;
  }
}

function cleanContainer() {
  const content = document.getElementById('content');
  content.innerHTML = '';
}

function loadindAnimation() {
  cleanContainer();

  const content = document.getElementById('content');

  const loadingDiv = document.createElement('div');
  loadingDiv.id = 'loading';
  loadingDiv.classList.add('center');

  const loaderDiv = document.createElement('div');
  loaderDiv.classList.add('loader');

  const circle1 = document.createElement('div');
  circle1.classList.add('circle');
  const circle2 = document.createElement('div');
  circle2.classList.add('circle');
  const circle3 = document.createElement('div');
  circle3.classList.add('circle');
  const circle4 = document.createElement('div');
  circle4.classList.add('circle');

  loaderDiv.appendChild(circle1);
  loaderDiv.appendChild(circle2);
  loaderDiv.appendChild(circle3);
  loaderDiv.appendChild(circle4);

  loadingDiv.appendChild(loaderDiv);
  content.appendChild(loadingDiv);
}

function showErrorToast(messageStr) {
  const toast = document.getElementById('toastError');
  const message = document.getElementById('message');

  message.innerText = messageStr;

  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast);
  toastBootstrap.show();
}

// interactive functions
function login() {
  doLogin().then(
    function (value) {
      document.getElementById("login").classList.add("gone");
      document.getElementById("logout").classList.remove("gone");
      document.getElementById("wish").classList.remove("gone");

      const myModalEl = document.getElementById('modalLogin');
      const modal = bootstrap.Modal.getInstance(myModalEl)
      modal.hide();
    }, function (error) {
      showErrorToast('Não foi possível executar o login, {}')
    }
  );
}

function loadCollectionIndexes() {
  loadindAnimation();

  loadCollections().then(
    function (collections) {

      cleanContainer();

      const content = document.getElementById('content');

      const grid = document.createElement('div');
      grid.classList.add('row', 'justify-content-md-center');

      for (let index = 0; index < collections.length; index++) {
        // card
        const card = document.createElement('div');
        card.classList.add('card', 'col-lg-3', 'm-2');

        // top image
        const cardImg = document.createElement('img');
        cardImg.classList.add('card-img-top');
        cardImg.alt = collections[index].name;
        cardImg.src = collections[index].images.logo;

        card.appendChild(cardImg);

        // body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.innerText = collections[index].name;

        const cardSubtitle = document.createElement('h6');
        cardSubtitle.classList.add('card-subtitle', 'mb-2', 'text-body-secondary');
        cardSubtitle.innerText = collections[index].id;

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardSubtitle);

        card.appendChild(cardBody);

        const cardList = document.createElement('ul');
        cardList.classList.add('list-group', 'list-group-flush');

        // item release date
        const releaseDate = createItem('Data lançamento:', collections[index].releaseDate);
        cardList.appendChild(releaseDate);

        // item legalities
        const legalities = createItemLegalities('Válido:', collections[index].legalities);
        cardList.appendChild(legalities);

        // item tcgo
        const tcgo = createItem('Código no TCG Online:', collections[index].ptcgoCode);
        cardList.appendChild(tcgo);

        // item series
        const series = createItem('Série:', collections[index].series);
        cardList.appendChild(series);

        card.appendChild(cardList);

        // footer
        const footer = document.createElement('div');
        footer.classList.add('card-footer', 'footer');

        const footerButton = document.createElement('button');
        footerButton.classList.add('btn', 'btn-primary');
        footerButton.addEventListener('click', () => loadCollectionCards(collections[index]));
        footerButton.innerText = 'Detalhes';

        footer.appendChild(footerButton);
        card.appendChild(footer);

        grid.appendChild(card);
      }

      content.appendChild(grid);
    },
    function (error) {
      showErrorToast('Não foi possível carregar as coleções, {' + error + '}');
    }
  )
}

function createItem (titleStr, valueStr) {
  const component = document.createElement('li');
  component.classList.add('list-group-item');

  const line = document.createElement('div');
  line.classList.add('line');

  const title = document.createElement('span');
  title.innerText = titleStr;

  const value = document.createElement('span');
  value.innerText = valueStr;

  line.appendChild(title);
  line.appendChild(value);

  component.appendChild(line);

  return component;
}

function createItemLegalities (titleStr, legalitiesObj) {
  const component = document.createElement('li');
  component.classList.add('list-group-item');

  const line = document.createElement('div');
  line.classList.add('line');

  const title = document.createElement('span');
  title.innerText = titleStr;

  line.appendChild(title);

  if (legalitiesObj.standard !== undefined) {
    const standard = document.createElement('span');
    standard.classList.add('badge', 'text-bg-primary');
    standard.innerText = 'standard';
    line.appendChild(standard);
  }

  if (legalitiesObj.expanded !== undefined) {
    const expanded = document.createElement('span');
    expanded.classList.add('badge', 'text-bg-secondary');
    expanded.innerText = 'expanded';
    line.appendChild(expanded);
  }

  if (legalitiesObj.unlimited !== undefined) {
    const unlimited = document.createElement('span');
    unlimited.classList.add('badge', 'text-bg-info');
    unlimited.innerText = 'unlimited';
    line.appendChild(unlimited);
  }

  component.appendChild(line);

  return component;
}

function loadCollectionCards(collection, searchTerm) {
  loadindAnimation();

  loadCardsFromCollection(collection.id, searchTerm).then(
    function (cards) {
      const content = document.getElementById('content');

      // cleaning container to new info
      cleanContainer();

      // breadcrumb
      const nav = document.createElement('nav');
      nav.ariaLabel = 'breadcrumb';

      const ol = document.createElement('ol');
      ol.classList.add('breadcrumb', 'bg-info');

      const home = document.createElement('li');
      home.classList.add('breadcrumb-item')

      const homeLink = document.createElement('a');
      homeLink.href = '#';
      homeLink.addEventListener('click', () => loadCollectionIndexes());
      homeLink.innerText = 'Coleções';

      home.appendChild(homeLink);

      const collection = document.createElement('li');
      collection.classList.add('breadcrumb-item', 'active');
      collection.ariaCurrent = 'page';
      collection.innerText = collection.name;

      ol.appendChild(home);
      ol.appendChild(collection);

      nav.appendChild(ol);

      content.appendChild(nav);

      // cards
      const grid = document.createElement('div');
      grid.classList.add('row', 'justify-content-md-center');

      for (let index = 0; index < cards.length; index++) {
        const card = document.createElement('div');
        card.classList.add('col-lg-3', 'mb-2');

        const cardImg = document.createElement('img');
        cardImg.classList.add('card-image-big', 'zoom');
        cardImg.src = cards[index].images.large;
        cardImg.alt = 'card-' + cards[index].id;
        cardImg.style.setProperty('cursor', 'pointer');
        cardImg.addEventListener('click', () => loadCardInfo(cards[index]));

        card.appendChild(cardImg);
        grid.appendChild(card);
      }

      content.appendChild(grid);
    },
    function (error) {

    }
  )
}

function loadCardInfo(card) {
  console.log(card);
}


