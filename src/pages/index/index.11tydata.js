module.exports = {
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

        lastPodcastEpisode: function(data) {
            const { episodes } = data.collections;

            if (!episodes || episodes.length === 0) {
                return;
            }

            const lastEpisode = episodes.at(-1);

            return lastEpisode;
        },
    },
};
