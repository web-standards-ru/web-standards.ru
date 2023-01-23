module.exports = {
    numberFeaturedEpisodes: 5,

    eleventyComputed: {
        indexArticles: function(data) {
            const articles = data.collections.articles.slice().reverse();

            const featured = articles.find((item) => item.data.featured);
            let notFeatured = [];
            for (let i = 0; notFeatured.length < 4; i++) {
                if (!articles[i]?.data.featured) {
                    notFeatured.push(articles[i]);
                }
            }
            return [featured, ...notFeatured];
        },

        articlesGroupsByYears: function(data) {
            const { articles } = data.collections;

            const articlesByYear = {};
            articles.forEach((article) => {
                const year = new Date(article.date).getFullYear();
                if (!articlesByYear[year]) {
                    articlesByYear[year] = [];
                }
                articlesByYear[year].push(article);
            });
            return Object.getOwnPropertyNames(articlesByYear).map((year) => {
                return {
                    year,
                    articles: articlesByYear[year].reverse(),
                };
            }).reverse();
        },
    },
};
