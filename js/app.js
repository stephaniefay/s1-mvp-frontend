function changeTheme (theme) {
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

function login () {
  document.getElementById("login").classList.add("gone");
  document.getElementById("logout").classList.remove("gone");
  document.getElementById("wish").classList.remove("gone");

  const myModalEl = document.getElementById('modalLogin');
  const modal = bootstrap.Modal.getInstance(myModalEl)
  modal.hide();
}

window.addEventListener('load', function () {
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme != null) {
    changeTheme(currentTheme);
  }

  document.getElementById("content").classList.remove('invisible');
  document.getElementById("themeSelector").classList.remove('invisible');
  document.getElementById("navbar").classList.remove('invisible');
  document.getElementById("loading").classList.add('invisible');
});
