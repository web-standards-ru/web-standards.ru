const navigationButton = document.querySelector('.navigation__button');
const pageBody = document.querySelector('.page__body');
const pageContent = document.querySelector('.page__content');
let isMenuHidden = false;

const isMenuHiddenCheck = () => {
    let attributeValue = navigationButton.getAttribute('aria-expanded');

    attributeValue === 'false' ? isMenuHidden = false : isMenuHidden = true;

    return isMenuHidden;
}

const handleNavigationMenuState = () => {
    if (isMenuHiddenCheck()) {
        navigationButton.setAttribute('aria-expanded', 'false');
        setTimeout(() => pageBody.classList.toggle('page__body--active'), 200);
        return;
    }

    navigationButton.setAttribute('aria-expanded', 'true');
    pageBody.classList.toggle('page__body--active');
};

const showHideNavigationMenu = () => {
    navigationButton.classList.toggle('navigation__button--active');
    pageContent.classList.toggle('page__content--active');
};

navigationButton.addEventListener('click', () => {
    handleNavigationMenuState();
    showHideNavigationMenu();
});
