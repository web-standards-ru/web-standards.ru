export default {
    pageTitle(data) {
        const titleSuffix = data.page.url === '/' ? '' : ' — Веб-стандарты';
        return data.title + titleSuffix;
    },
};
