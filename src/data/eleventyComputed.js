export default {
    titleSuffix(data) {
        return data.page.url === '/' ? '' : ' — Веб-стандарты';
    },

    pageTitle(data) {
        return data.title + data.titleSuffix;
    },
};
