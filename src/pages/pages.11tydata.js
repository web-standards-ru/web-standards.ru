module.exports = {
    numberFeaturedEpisodes: 5,

    eleventyComputed: {
        filteredPodcasts: function(data) {
            const { episodes } = data.collections;

            if (!episodes) {
                return null;
            }

            const featuredEpisodes = episodes.slice(0, data.numberFeaturedEpisodes);
            const restEpisodes = episodes.slice(data.numberFeaturedEpisodes);

            return {
                featuredEpisodes,
                restEpisodes,
            };
        },
    },
};
