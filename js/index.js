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

  typeNavbar().then();
});

function sleep(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function typeNavbar () {
  const navbarName = 'MyWish';
  const sparkle = '&#x2728;';
  const speed = 100;

  const logo = document.getElementById("logo");

  for (let index = 0; index < navbarName.length; index++) {
    logo.innerHTML += navbarName.charAt(index);
    await sleep(speed).then()
  }

  logo.innerHTML += sparkle;
}

function changeTheme(theme) {
  const themeDOM = document.getElementById("theme");

  switch (theme) {
    case 'light':
      themeDOM.href = 'css/bootstrap-minty.css';
      localStorage.setItem('theme', theme);
      document.getElementById("theme-selected").src = 'assets/auxiliaries/sun.svg';
      break;
    case 'dark':
      themeDOM.href = 'css/bootstrap-slate.css';
      localStorage.setItem('theme', theme);
      document.getElementById("theme-selected").src = 'assets/auxiliaries/moon.svg';
      break;
  }
}

function cleanContainer() {
  const content = document.getElementById('content');
  content.innerHTML = '';
}

function loadingAnimation() {
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
  const message = document.getElementById('messageError');

  message.innerText = messageStr;

  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast);
  toastBootstrap.show();
}

function showSuccessToast(messageStr) {
  const toast = document.getElementById('toastSuccess');
  const message = document.getElementById('messageSuccess');

  message.innerText = messageStr;

  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast);
  toastBootstrap.show();
}

function getRandomHexColor() {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
}

// interactive functions

// wishes functions
function loadAllWishes() {
  loadingAnimation();

  loadWishes().then(
    function (response) {
      const wishes = response.wishes
      cleanContainer();

      const content = document.getElementById('content');

      const createWishDiv = document.createElement('div');
      createWishDiv.classList.add('align-right');

      const createWishButton = document.createElement('button');
      createWishButton.classList.add('btn', 'btn-primary');
      createWishButton.type = 'button';

      const wishModal = new bootstrap.Modal(document.getElementById('createWishlist'));
      createWishButton.innerText = 'Criar uma MyWish'
      createWishButton.addEventListener("click", () => wishModal.show())

      document.getElementById('createWishlist').addEventListener('hidden.bs.modal', function (event) {
        document.getElementById('nameWishlist').value = '';
        document.getElementById('descriptionTextarea').value = '';
      });

      createWishDiv.appendChild(createWishButton);
      content.appendChild(createWishDiv);

      const container = document.createElement('div')
      container.classList.add('wish');
      container.style.width = '100%';
      container.style.height = '100%';

      if (wishes != null) {
        const list = document.createElement('ul');
        list.classList.add();

        for (let index = 0; index < wishes.length; index++) {
          const item = document.createElement('li');
          item.addEventListener('click', () => loadWish(wishes[index]));
          item.classList.add('hvr-icon-pop', 'pointer');

          if (wishes[index].color != null) {
            item.style = '--accent-color:' + wishes[index].color;
          } else {
            item.style = '--accent-color:' + getRandomHexColor();
          }

          const icon = document.createElement('div');
          icon.classList.add('icon');
          icon.innerHTML = '<i class="fa-solid fa-star hvr-icon"></i>';
          item.appendChild(icon);

          const title = document.createElement('div');
          title.classList.add('title');
          title.innerText = wishes[index].name;
          item.appendChild(title);

          const description = document.createElement('div');
          description.classList.add('descr');
          description.innerText = wishes[index].description;
          item.appendChild(description);

          list.appendChild(item);
        }
        container.appendChild(list);

        content.appendChild(container);

      } else {

      }
    }, function (error) {
      showErrorToast('Não foi possível carregar wishes, {}')
    })
}

function loadWish(wishObj) {
  loadingAnimation();

  loadCardsFromWish(wishObj.id).then(
    function (response) {
      cleanContainer();
      const cards = response.cards;

      const content = document.getElementById('content');

      // breadcrumb
      const nav = document.createElement('nav');
      nav.ariaLabel = 'breadcrumb';

      const ol = loadNavigationWishLevel(wishObj);

      nav.appendChild(ol);

      content.appendChild(nav);

      const grid = document.createElement('div');
      grid.classList.add('row', 'justify-content-md-center');

      for (let index = 0; index < cards.length; index++) {
        const card = document.createElement('div');
        card.classList.add('image-container', 'col-lg-3', 'mb-2');

        const cardImg = document.createElement('img');
        cardImg.src = cards[index].images.large;
        cardImg.alt = 'card-' + cards[index].id;

        card.appendChild(cardImg);

        const overlay = document.createElement('div');
        overlay.classList.add('overlay');

        buildOverlay(overlay, cards[index], 'remove', wishObj);
        card.appendChild(overlay);

        grid.appendChild(card);
      }

      content.appendChild(grid);
    }, function (error) {
      showErrorToast('Não foi possível carregar a wish, {}')
    }
  );
}

function loadNavigationWishLevel(wishObj) {
  const ol = document.createElement('ol');
  ol.classList.add('breadcrumb', 'bg-info');

  const home = document.createElement('li');
  home.classList.add('breadcrumb-item')

  const homeLink = document.createElement('a');
  homeLink.href = '#';
  homeLink.addEventListener('click', () => loadAllWishes());
  homeLink.innerText = 'Listas de Desejo';

  home.appendChild(homeLink);

  const collection = document.createElement('li');
  collection.classList.add('breadcrumb-item', 'active');
  collection.ariaCurrent = 'page';
  collection.innerText = wishObj.name;

  ol.appendChild(home);
  ol.appendChild(collection);
  return ol;
}

function loadColorPicker(value) {
  const body = document.getElementById('formWishBody');
  if (value === 'off') {
    document.getElementById('useCustomColor').value = 'on';

    const div = document.createElement('div');
    div.classList.add('mb-3', 'center');
    div.id = 'wishListColorPicker';

    const label = document.createElement('label');
    label.classList.add('form-label');
    label.for = 'wishlistColor';
    label.innerText = 'Escolha sua cor! ';
    div.appendChild(label);

    const input = document.createElement('input');
    input.classList.add('form-control', 'form-control-color');
    input.type = 'color';
    input.id = 'wishlistColor';
    input.value = '#563d7c';
    input.title = 'Escolha a cor que preferir &#x2728;'
    div.appendChild(input);

    body.appendChild(div);
  } else {
    document.getElementById('useCustomColor').value = 'off';

    body.removeChild(document.getElementById('wishListColorPicker'));
  }
}

function createWishlist() {
  const nameInput = document.getElementById('nameWishlist');
  const descriptionInput = document.getElementById('descriptionTextarea');
  const colorInput = document.getElementById('wishlistColor');

  const modal = bootstrap.Modal.getInstance(document.getElementById('createWishlist'));
  modal.hide()
  const obj = {'name': nameInput.value, 'description': descriptionInput.value, 'color': (colorInput != null) ? colorInput.value : null}

  createWish(obj).then(
    function (response) {
      loadAllWishes();
    }, function (error) {
      showErrorToast('Não foi possível criar uma lista de desejos, {}')
    }
  )
}

function addCardToWish (wishObj, cardObj) {
  putCardInWish(wishObj.id, {'ids': [cardObj.id]}).then(response => {
    showSuccessToast(response.message)
  })
}

function removeCardFromWish (wishObj, cardObj) {
  deleteCardFromWish(wishObj.id, {'ids': [cardObj.id]}).then(response => {
    showSuccessToast(response.message);
    loadWish(wishObj);
  })
}

// collection functions
function loadCollectionIndexes() {
  loadingAnimation();

  loadCollections().then(
    function (data) {

      cleanContainer();

      const collections = data.sets
      const content = document.getElementById('content');

      const grid = document.createElement('div');
      grid.classList.add('row', 'justify-content-md-center');

      for (let index = 0; index < collections.length; index++) {
        // card
        const card = document.createElement('div');
        card.classList.add('card', 'col-lg-3', 'm-2');

        // top image
        const cardImg = document.createElement('img');
        cardImg.classList.add('card-img-top', 'img-card');
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

        // list
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

function createItem(titleStr, valueStr) {
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

function createItemLegalities(titleStr, legalitiesObj) {
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

function loadNavigationCollectionLevel(collectionObj) {
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
  collection.innerText = collectionObj.name;

  ol.appendChild(home);
  ol.appendChild(collection);
  return ol;
}

function loadCollectionCards(collectionObj, searchTerm) {
  loadingAnimation();

  loadCardsFromCollection(collectionObj.id, searchTerm).then(
    function (data) {
      const content = document.getElementById('content');

      cleanContainer();

      const cards = data.cards

      // breadcrumb
      const nav = document.createElement('nav');
      nav.ariaLabel = 'breadcrumb';

      const ol = loadNavigationCollectionLevel(collectionObj);

      nav.appendChild(ol);

      content.appendChild(nav);

      // cards
      const grid = document.createElement('div');
      grid.classList.add('row', 'justify-content-md-center');

      for (let index = 0; index < cards.length; index++) {
        const card = document.createElement('div');
        card.classList.add('image-container', 'col-lg-3', 'mb-2');

        const cardImg = document.createElement('img');
        cardImg.classList.add('card-image-big', 'zoom');
        cardImg.src = cards[index].images.large;
        cardImg.alt = 'card-' + cards[index].id;
        cardImg.style.setProperty('cursor', 'pointer');
        cardImg.addEventListener('click', () => loadCardInfo(collectionObj, cards[index]));

        card.appendChild(cardImg);
        grid.appendChild(card);
      }

      content.appendChild(grid);
    },
    function (error) {

    }
  )
}

// card functions
function loadCardInfo(collectionObj, cardObj) {
  cleanContainer();
  const content = document.getElementById('content');

  // breadcrumb
  const nav = document.createElement('nav');
  nav.ariaLabel = 'breadcrumb';

  const ol = loadNavigationCardLevel(collectionObj, cardObj);

  nav.appendChild(ol);
  content.appendChild(nav);

  const grid = document.createElement('div');
  grid.id = 'card-details';
  grid.classList.add('columns');

  const columnOneThird = document.createElement('div');
  columnOneThird.classList.add('column', 'is-one-third', 'image-container');

  const imgDiv = document.createElement('div');

  const cardImage = document.createElement('img');
  cardImage.classList.add('card-image');
  cardImage.src = cardObj.images.large;

  imgDiv.appendChild(cardImage);

  const overlay = document.createElement('div');
  overlay.classList.add('overlay');

  buildOverlay(overlay, cardObj, 'add')
  imgDiv.appendChild(overlay);

  columnOneThird.appendChild(imgDiv);
  grid.appendChild(columnOneThird);

  const column6 = document.createElement('div');
  column6.classList.add('column', 'is-6', 'is-offset-1');

  const cardDetails = document.createElement('div');
  cardDetails.classList.add('content', 'card-details');

  const navHead = document.createElement('nav');
  navHead.classList.add('card-details_head', 'level');

  const levelLeft = document.createElement('div');
  levelLeft.classList.add('level-left');

  const levelItem1 = document.createElement('div');
  levelItem1.classList.add('level-item');

  const title = document.createElement('span');
  title.classList.add('title', 'is-3');
  title.innerText = cardObj.name;

  const type = document.createElement('div');
  type.classList.add('title', 'is-5', 'has-text-muted');
  type.innerText = cardObj.supertype + ' - ' + cardObj.subtypes;

  title.appendChild(type);
  levelItem1.appendChild(title);
  levelLeft.appendChild(levelItem1);
  navHead.appendChild(levelLeft);

  if (cardObj.hp != null) {
    const levelRight = document.createElement('div');
    levelRight.classList.add('level-right');

    const levelItem2 = document.createElement('div');
    levelItem2.classList.add('level-item');

    const info = document.createElement('span');
    info.classList.add('title', 'is-5', 'is-flex', 'is-align-items-center');

    const hp = document.createElement('span');
    hp.classList.add('mr-2');
    hp.innerText = 'HP ' + cardObj.hp;

    info.appendChild(hp);

    for (let index = 0; index < cardObj.types.length; index++) {
      const typeImage = document.createElement('img');
      typeImage.classList.add('energy');
      typeImage.src = 'assets/types/' + cardObj.types[index].toLowerCase() + '.svg';
      typeImage.alt = cardObj.types[index];

      info.appendChild(typeImage);
    }

    levelItem2.appendChild(info);
    levelRight.appendChild(levelItem2);
    navHead.appendChild(levelRight);
  }

  cardDetails.appendChild(navHead);

  const divider = document.createElement('hr');
  divider.classList.add('solid')

  cardDetails.appendChild(divider);

  if (cardObj.rules != null) {
    const rulesSection = document.createElement('section');

    const rules = document.createElement('div');
    rules.classList.add('card-details_ability');

    const rulesTitle = document.createElement('p');
    rulesTitle.classList.add('heading');
    rulesTitle.innerText = 'Regras';

    rules.appendChild(rulesTitle);

    for (let index = 0; index < cardObj.rules.length; index++) {
      const rule = document.createElement('p');
      rule.classList.add('is-flex', 'is-flex-direction-column');
      rule.innerText = cardObj.rules[index];

      rules.appendChild(rule);
    }

    rulesSection.appendChild(rules);
    cardDetails.appendChild(rulesSection);
  }

  if (cardObj.abilities != null) {
    const abilitiesSection = document.createElement('section');

    const abilitiesTitle = document.createElement('p');
    abilitiesTitle.classList.add('heading');
    abilitiesTitle.innerText = 'Habilidades';

    abilitiesSection.appendChild(abilitiesTitle);

    for (let index = 0; index < cardObj.abilities.length; index++) {
      const abilityContainer = document.createElement('div');
      abilityContainer.classList.add('card-details_ability');

      const ability = document.createElement('div');
      ability.classList.add('title', 'is-4', 'has-text-muted', 'is-flex', 'is-align-items-center', 'mb-1');

      const abilityImage = document.createElement('img');
      abilityImage.classList.add('ability-type');
      abilityImage.src = 'assets/abilities/' + getImageAbility(cardObj.abilities[index]) + '.png';
      abilityImage.alt = cardObj.abilities[index].type;

      const abilityName = document.createElement('span');
      abilityName.innerText = cardObj.abilities[index].name;

      ability.appendChild(abilityImage);
      ability.appendChild(abilityName);
      abilityContainer.appendChild(ability);

      const abilityDescriptor = document.createElement('p');
      abilityDescriptor.innerText = cardObj.abilities[index].text;

      abilityContainer.appendChild(abilityDescriptor);
      abilitiesSection.appendChild(abilityContainer);
    }

    cardDetails.appendChild(abilitiesSection);
  }

  if (cardObj.attacks != null) {
    const attackSection = document.createElement('section');

    const attackTitle = document.createElement('p');
    attackTitle.classList.add('heading');
    attackTitle.innerText = 'Ataques';

    attackSection.appendChild(attackTitle);

    const tableAttack = document.createElement('table');

    for (let index = 0; index < cardObj.attacks.length; index++) {
      const body = document.createElement('tbody');
      body.classList.add('card-details_attack');

      const rowDescriptor = document.createElement('tr');
      const energyCost = document.createElement('td');
      energyCost.classList.add('nowrap');

      for (let energies = 0; energies < cardObj.attacks[index].cost.length; energies++) {
        const energy = document.createElement('img');
        energy.classList.add('energy');
        energy.src = 'assets/types/' + cardObj.attacks[index].cost[energies].toLowerCase() + '.svg';
        energy.alt = cardObj.attacks[index].cost[energies];

        energyCost.appendChild(energy);
      }

      rowDescriptor.appendChild(energyCost);

      const attackName = document.createElement('td');
      attackName.classList.add('attack-name');

      const name = document.createElement('span');
      name.classList.add('title', 'is-4');
      name.innerText = cardObj.attacks[index].name;

      attackName.appendChild(name);
      rowDescriptor.appendChild(attackName);

      const attackDamage = document.createElement('td');
      attackDamage.classList.add('attack-name');

      const damage = document.createElement('span');
      damage.classList.add('title', 'is-4', 'is-muted', 'nowrap');
      damage.innerText = cardObj.attacks[index].damage;

      attackDamage.appendChild(damage);
      rowDescriptor.appendChild(attackDamage);

      body.appendChild(rowDescriptor);

      const rowEffect = document.createElement('tr');
      const column = document.createElement('td');
      column.colSpan = 3;

      const text = document.createElement('p');
      text.innerText = cardObj.attacks[index].text;

      column.appendChild(text);
      rowEffect.appendChild(column);
      body.appendChild(rowEffect);

      tableAttack.appendChild(body);
    }

    cardDetails.appendChild(tableAttack);
  }

  const footer = document.createElement('section');

  const columns = document.createElement('div');
  columns.classList.add('columns', 'is-flex-wrap-wrap');

  const columnWeakness = buildColumnEnergySimple('Fraqueza', cardObj.weaknesses, 'weakness');
  columns.appendChild(columnWeakness);

  const columnResistance = buildColumnEnergySimple('Resistência', cardObj.resistances, 'resistance');
  columns.appendChild(columnResistance);

  const columnRetreat = buildColumnEnergyMultiple('Recuo', cardObj.retreatCost, 'retreat');
  columns.appendChild(columnRetreat);

  const columnRarity = buildColumnOnlyText('Raridade', cardObj.rarity, 'rarity');
  columns.appendChild(columnRarity);

  const columnSet = buildColumnTextWithImage('Set', collectionObj.name, collectionObj.images.symbol, 'set');
  columns.appendChild(columnSet);

  const columnNumber = buildColumnOnlyText('Número', cardObj.number + '/' + collectionObj.printedTotal, 'number');
  columns.appendChild(columnNumber);

  if (cardObj.legalities != null) {
    const legalities = document.createElement('div');
    legalities.classList.add('flex', 'align-items-center');

    const div = document.createElement('div');

    if (cardObj.legalities.standard !== undefined) {
      const standard = document.createElement('span');
      standard.classList.add('badge', 'text-bg-primary');
      standard.innerText = 'standard';
      div.appendChild(standard);
    }

    if (cardObj.legalities.expanded !== undefined) {
      const expanded = document.createElement('span');
      expanded.classList.add('badge', 'text-bg-secondary');
      expanded.innerText = 'expanded';
      div.appendChild(expanded);
    }

    if (cardObj.legalities.unlimited !== undefined) {
      const unlimited = document.createElement('span');
      unlimited.classList.add('badge', 'text-bg-info');
      unlimited.innerText = 'unlimited';
      div.appendChild(unlimited);
    }

    legalities.appendChild(div);
    columns.appendChild(legalities);
  }

  footer.appendChild(columns);
  cardDetails.appendChild(footer);

  column6.appendChild(cardDetails);
  grid.appendChild(column6);

  content.appendChild(grid);
}

function buildOverlay(overlay, cardObj, flag, wishObj) {
  if (flag === 'add') {
    loadWishes(cardObj.id).then(
      function (response) {
        const wishes = response.wishes;

        const div = document.createElement('div');
        div.classList.add('d-flex', 'justify-content-evenly', 'align-items-center');
        div.style.height = '100%';
        div.style.width = '100%';

        const ul = document.createElement('ul');
        ul.classList.add('list-group', 'list-group-flush', 'justify-content-evenly', 'align-items-stretch');
        ul.style.width = '100%'
        ul.style.height = '100%'
        for (let index = 0; index < wishes.length; index++) {
          const li = document.createElement('li');
          li.classList.add('list-group-item', 'pointer', 'transparent', 'list-group-item-primary', 'text-center', 'hvr-icon-pop');
          li.addEventListener('click', () => addCardToWish(wishes[index], cardObj));
          li.innerHTML = '<i class="fa-solid fa-star hvr-icon"></i> Adicionar a ' + wishes[index].name;

          ul.appendChild(li)
        }

        div.append(ul)
        overlay.appendChild(div)
      },
      function (error) {

      }
    )
  } else {
    const div = document.createElement('div');
    div.classList.add('d-flex', 'justify-content-evenly', 'align-items-center');
    div.style.height = '100%';
    div.style.width = '100%';

    const ul = document.createElement('ul');
    ul.classList.add('list-group', 'list-group-flush', 'justify-content-evenly', 'align-items-stretch');
    ul.style.width = '100%'
    ul.style.height = '100%'

    const li = document.createElement('li');
    li.classList.add('list-group-item', 'pointer', 'transparent', 'list-group-item-secondary', 'text-center', 'hvr-icon-fade');
    li.addEventListener('click', () => removeCardFromWish(wishObj, cardObj));
    li.innerHTML = '<i class="fa-solid fa-trash hvr-icon"></i> Remover da Lista';

    ul.appendChild(li)

    div.append(ul)
    overlay.appendChild(div)
  }
}

function buildColumnTextWithImage(titleStr, text, imgSrc, modifier) {
  const column = document.createElement('div');
  column.classList.add('column', 'is-one-third');

  const details = document.createElement('div');
  details.classList.add('card-details_' + modifier);

  const title = document.createElement('p');
  title.classList.add('heading');
  title.innerText = titleStr;

  details.appendChild(title);

  const content = document.createElement('p');
  content.classList.add('title', 'is-5');

  const span = document.createElement('span');
  span.classList.add('is-flex', 'is-align-items-center');
  span.innerText = text;

  const img = document.createElement('img');
  img.classList.add('ml-2');
  img.width = 24;
  img.src = imgSrc;
  img.alt = text;

  span.appendChild(img);
  content.appendChild(span);

  details.appendChild(content);

  column.appendChild(details);
  return column;
}

function buildColumnOnlyText(titleStr, text, modifier) {
  const column = document.createElement('div');
  column.classList.add('column', 'is-one-third');

  const details = document.createElement('div');
  details.classList.add('card-details_' + modifier);

  const title = document.createElement('p');
  title.classList.add('heading');
  title.innerText = titleStr;

  details.appendChild(title);

  const content = document.createElement('p');
  content.classList.add('title', 'is-5');
  content.innerText = text;

  details.appendChild(content);

  column.appendChild(details);
  return column;
}

function buildColumnEnergyMultiple(titleStr, arrayObj, modifier) {
  const column = document.createElement('div');
  column.classList.add('column', 'is-one-third');

  const details = document.createElement('div');
  details.classList.add('card-details_' + modifier);

  const title = document.createElement('p');
  title.classList.add('heading');
  title.innerText = titleStr;

  details.appendChild(title);

  if (arrayObj != null) {
    for (let index = 0; index < arrayObj.length; index++) {
      const energy = document.createElement('img');
      energy.classList.add('energy');
      energy.src = 'assets/types/' + arrayObj[index].toLowerCase() + '.svg';
      energy.alt = arrayObj[index];

      details.appendChild(energy);
    }
  } else {
    const notDefined = document.createElement('p');
    notDefined.classList.add('title', 'is-5', 'is-flex', 'is-align-items-center');
    notDefined.innerText = 'N/A';

    details.appendChild(notDefined);
  }

  column.appendChild(details);
  return column;
}

function buildColumnEnergySimple(titleStr, arrayObj, modifier) {
  const column = document.createElement('div');
  column.classList.add('column', 'is-one-third');

  const details = document.createElement('div');
  details.classList.add('card-details_' + modifier);

  const title = document.createElement('p');
  title.classList.add('heading');
  title.innerText = titleStr;

  details.appendChild(title);

  if (arrayObj != null) {
    for (let index = 0; index < arrayObj.length; index++) {
      const item = document.createElement('p');
      item.classList.add('title', 'is-5', 'is-flex', 'is-align-items-center');

      const energy = document.createElement('img');
      energy.classList.add('energy');
      energy.src = 'assets/types/' + arrayObj[index].type.toLowerCase() + '.svg';
      energy.alt = arrayObj[index].type;

      const value = document.createElement('span');
      value.classList.add('ml-1');
      value.innerText = arrayObj[index].value;

      item.appendChild(energy);
      item.appendChild(value);

      details.appendChild(item);
    }
  } else {
    const notDefined = document.createElement('p');
    notDefined.classList.add('title', 'is-5', 'is-flex', 'is-align-items-center');
    notDefined.innerText = 'N/A';

    details.appendChild(notDefined);
  }

  column.appendChild(details);
  return column;
}

function loadNavigationCardLevel(collectionObj, cardObj) {
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
  collection.classList.add('breadcrumb-item')

  const collectionLink = document.createElement('a');
  collectionLink.href = '#';
  collectionLink.addEventListener('click', () => loadCollectionCards(collectionObj, ''));
  collectionLink.innerText = collectionObj.name;

  collection.appendChild(collectionLink);

  const card = document.createElement('li');
  card.classList.add('breadcrumb-item', 'active');
  card.ariaCurrent = 'page';
  card.innerText = cardObj.name;

  ol.appendChild(home);
  ol.appendChild(collection);
  ol.appendChild(card);

  return ol;
}

function getImageAbility(ability) {
  let newValue = ability.type.replaceAll('é', 'e');
  newValue = newValue.replaceAll('-', '');

  return newValue.toLowerCase();
}


