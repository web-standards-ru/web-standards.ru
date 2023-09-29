module.exports = {
    eleventyComputed: {
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
