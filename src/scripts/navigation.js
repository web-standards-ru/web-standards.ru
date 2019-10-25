const navigationPages = document.querySelector('.navigation__pages');
const navigationButton = document.querySelector('.navigation__button');
let isMenuHidden = false;

const isMenuHiddenCheck = () => {
  let attributeValue = navigationButton.getAttribute("aria-expanded");

  attributeValue === 'false' ? isMenuHidden = false : isMenuHidden = true;

  return isMenuHidden;
}

const handleNavigationMenuState = () => {
    if (isMenuHiddenCheck()) {
      navigationButton.setAttribute("aria-expanded", "false");
      return;
    } 
    navigationButton.setAttribute("aria-expanded", "true");
};

const showHideNavigationMenu = () => {
    navigationPages.classList.toggle('navigation__pages--active');
};

navigationButton.addEventListener('click', () => {
    handleNavigationMenuState();
    showHideNavigationMenu();
});
