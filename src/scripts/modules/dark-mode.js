// Этот код нужен для предотвращения мерцания светлой/темной темы до загрузки и парсинга CSS
const storageKey = 'color-scheme';
window.classNameDark = 'page--dark-mode';
const preferDarkQuery = '(prefers-color-scheme: dark)';
const colorSchemeMediaQuery = window.matchMedia(preferDarkQuery);
const isSupportsColorSchemeQuery = colorSchemeMediaQuery.media === preferDarkQuery;
const isPrefersDarkColorScheme = colorSchemeMediaQuery.matches;

function applyColorScheme(isDarkMode, shouldPersist = false) {
    document.querySelector('html').classList.toggle(window.classNameDark, isDarkMode);

    if (shouldPersist) {
        try {
            if (isPrefersDarkColorScheme === isDarkMode) {
                localStorage.removeItem(storageKey);
            } else {
                localStorage.setItem(storageKey, isDarkMode ? 'dark' : 'light');
            }
        } catch { }
    }
}

function toggleDarkMode() {
    applyColorScheme(
        !document.querySelector('html').classList.contains(window.classNameDark),
        true
    );
}

colorSchemeMediaQuery.addEventListener('change', (mediaQuery) => {
    applyColorScheme(mediaQuery.matches);
});

let localStorageTheme = null;
try {
    localStorageTheme = localStorage.getItem(storageKey);
} catch { }
const hasLocalStorageValue = localStorageTheme !== null && ['dark', 'light'].indexOf(localStorageTheme) >= 0;

// Определяем источник правды
if (hasLocalStorageValue) {
    // Источник правды - localStorage
    applyColorScheme(localStorageTheme === 'dark');
} else if (isSupportsColorSchemeQuery) {
    // В противном случае берём системное значение
    applyColorScheme(isPrefersDarkColorScheme);
}

document.addEventListener('DOMContentLoaded', () => {
    const colorSchemeButton = document.querySelector('.scheme-switcher__button');
    colorSchemeButton.addEventListener('click', () => {
        toggleDarkMode();
    });
});
