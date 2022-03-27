const burger = document.querySelector('.nav__burger');
const navlinks = document.querySelector('.nav__links');
const xIcon = document.querySelector('.nav__x-icon');
const mobileWidth = 500;

renderMenuIcon();

// Toggle visibility of menu icon and navlinks and change navlinks layout
// depending on screen width
function renderMenuIcon() {
  if (window.innerWidth <= mobileWidth) {
    burger.classList.add('visible');
    navlinks.classList.remove('visible');
    xIcon.classList.remove('visible');
    navlinks.classList.add('nav__links_mobile');
  } else {
    burger.classList.remove('visible');
    navlinks.classList.add('visible');
    xIcon.classList.remove('visible');
    navlinks.classList.remove('nav__links_mobile');
  }
}

// Toggles mobile menu and icon visibility
function toggleMobileMenu() {
  navlinks.classList.toggle('visible');
  burger.classList.toggle('visible');
  xIcon.classList.toggle('visible');
}

window.addEventListener('resize', renderMenuIcon);
burger.addEventListener('click', toggleMobileMenu);
xIcon.addEventListener('click', toggleMobileMenu);
