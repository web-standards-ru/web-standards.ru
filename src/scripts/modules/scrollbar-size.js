function setScrollbarSize() {
    const root = document.documentElement;
    root.style.setProperty('--scrollbar-size', window.innerWidth - root.offsetWidth);
}

setScrollbarSize();

window.addEventListener('resize', setScrollbarSize);
window.screen.orientation.addEventListener('change', setScrollbarSize);
