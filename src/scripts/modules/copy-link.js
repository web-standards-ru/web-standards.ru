const buttons = [...document.querySelectorAll('.tooltip__button')];
const successClassName = 'tooltip__label--success';
const errorClassName = 'tooltip__label--error';
let timeout;

function setDefaultState(tooltip) {
    tooltip.innerText = 'Скопировать ссылку';
    tooltip.classList.remove(successClassName);
}

function setSuccessState(tooltip) {
    tooltip.innerText = 'Скопировано';
    tooltip.classList.add(successClassName);
}

function setErrorState(tooltip) {
    tooltip.innerText = 'Не удалось скопировать';
    tooltip.classList.remove(errorClassName);
}

function handleCopy() {
    const tooltip = this.nextSibling;
    const hash = this.getAttribute('data-href');
    const url = window.location.href.replace(window.location.hash, '');

    navigator.clipboard.writeText(`${url}${hash}`)
        .then(() => {
            setSuccessState(tooltip);
        })
        .catch(() => {
            setErrorState(tooltip);
        });
}

function handleMouseEnter() {
    const tooltip = this.nextSibling;

    if (timeout) {
        return;
    }

    setDefaultState(tooltip);
}

function handleMouseOut() {
    const tooltip = this.nextSibling;

    if (!tooltip.classList.contains(successClassName) && !tooltip.classList.contains(errorClassName)) {
        return;
    }

    timeout = setTimeout(() => {
        this.blur();
        setDefaultState(tooltip);
    }, 1000);
}

buttons.forEach((button) => {
    button.addEventListener('click', handleCopy);
    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseout', handleMouseOut);
});
