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

function loadindAnimation() {
  const content = document.getElementById('content');

  let html = '<div id="loading" class="center">\n' +
    '  <div class="loader">\n' +
    '    <div class="circle"></div>\n' +
    '    <div class="circle"></div>\n' +
    '    <div class="circle"></div>\n' +
    '    <div class="circle"></div>\n' +
    '  </div>\n' +
    '</div>'

  content.innerHTML = html;
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
    function (arrayCollections) {
      const content = document.getElementById('content');
      let html = '';
      let column = 0;
      for (let index = 0; index < arrayCollections.length; index++) {
        if (column === 0) {
          html += '<div class="row justify-content-md-center">';
        }

        html += '<div class="card col-lg-3 m-2">';
        html += ' <img src="' + arrayCollections[index].images.logo + '" class="card-img-top" alt="...">';
        html += '<div class="card-body">';
        html += '<h5 class="card-title">' + arrayCollections[index].name + '</h5>';
        html += '<h6 class="card-subtitle mb-2 text-body-secondary">' + arrayCollections[index].id + '</h6>'
        html += '</div>';
        html += '<ul class="list-group list-group-flush">'

        // release date
        html += '<li class="list-group-item"><div class="line"><span>Data lançamento:</span>' + arrayCollections[index].releaseDate + ' </div></li>';

        // legalities
        html += '<li class="list-group-item"><div class="line"><span>Válido:</span>';
        if (arrayCollections[index].legalities.standard !== undefined)
          html += '<span class="badge text-bg-primary">standard</span>'
        if (arrayCollections[index].legalities.expanded !== undefined)
          html += '<span class="badge text-bg-secondary">expanded</span>'
        if (arrayCollections[index].legalities.unlimited !== undefined)
          html += '<span class="badge text-bg-info">unlimited</span>'
        html += '</div></li>'

        // tcgo
        html += '<li class="list-group-item"><div class="line"><span>Código no TCG Online:</span>' + arrayCollections[index].ptcgoCode + '</div></li>';

        // series
        html += '<li class="list-group-item"><div class="line"><span>Série:</span>' + arrayCollections[index].series + '</div></li>';

        html += '</ul>';
        html += '<div class="card-footer footer"><button href="#" class="btn btn-primary" onclick="loadCollectionCards(\'' + arrayCollections[index].id + '\', \'\')">Detalhes</button></div>'
        html += '</div>';

        column++;

        if (column === 3) {
          html += '</div>';
          column = 0;
        }

      }

      content.innerHTML = html;
    },
    function (error) {
      showErrorToast('Não foi possível carregar as coleções, {' + error + '}');
    }
  )
}

function loadCollectionCards(collectionId, searchTerm) {
  loadindAnimation();

  loadCardsFromCollection(collectionId, searchTerm).then(
    function (value) {
      const content = document.getElementById('content');

      let html = '<nav style="--bs-breadcrumb-divider: \'>\';" aria-label="breadcrumb">';
      html += '<ol class="breadcrumb bg-info">';
      html += '<li class="breadcrumb-item"><a href="#" onclick="loadCollectionIndexes()">Coleções</a></li>';
      html += '<li class="breadcrumb-item active" aria-current="page">' + collectionId + '</li>';
      html += '</ol>';
      html += '</nav>';


      content.innerHTML = html;
    },
    function (error) {

    }
  )
}


