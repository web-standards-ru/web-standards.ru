const navigationPages = document.querySelector('.navigation__pages');
const navigationButton = document.querySelector('.navigation__button');

navigationButton.addEventListener('click', event => {
  event.target.classList.toggle('navigation__button--active');
  navigationPages.classList.toggle('navigation__pages--active'); 
});
