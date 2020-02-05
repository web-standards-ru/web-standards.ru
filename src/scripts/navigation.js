const navigationButton = document.querySelector('.navigation__button');
const pageBody = document.querySelector('.page__body');
const pageContent = document.querySelector('.page__content');

const isMenuHiddenCheck = () => {
    let attributeValue = navigationButton.getAttribute('aria-expanded');

    return attributeValue === 'true';
};

const handleNavigationMenuState = () => {
    const isMenuHidden = isMenuHiddenCheck();
    navigationButton.setAttribute('aria-expanded', !isMenuHidden);

    setTimeout(() => pageBody.classList.toggle('page__body--active'), 200);
};

const toggleNavigationMenu = () => {
    navigationButton.classList.toggle('navigation__button--active');
    pageContent.classList.toggle('page__content--active');
};

navigationButton.addEventListener('click', () => {
    handleNavigationMenuState();
    toggleNavigationMenu();
});
