function filterPeople(peopleList, filterList) {
    return peopleList
        .filter((person) => {
            // Иногда filterList это строка, а не массив, поэтому всегда делаем массив
            const filterListNormalized = [].concat(filterList);

            return filterListNormalized.includes(person.fileSlug);
        })
        .map((person) => {
            return person.data;
        });
}

module.exports = {
    layout: 'article.njk',

    numberOfRelatedArticles: 3,

    eleventyComputed: {
        authorData: function(data) {
            return filterPeople(data.collections.people, data.author);
        },

        translatorsData: function(data) {
            return filterPeople(data.collections.people, data.translators);
        },

        editorsData: function(data) {
            return filterPeople(data.collections.people, data.editors);
        },

        relatedArticles: function(data) {
            const articles = data.collections.article;

            if (!articles) {
                return null
            }

            const length = articles.length;

            return articles
                .slice(length - 1 - data.numberOfRelatedArticles , length)
                .reverse()
                .filter(post => post.url !== data.page.url)
                .slice(0, data.numberOfRelatedArticles);
        },
    },
};
