export default {
    layout: 'page.njk',

    pagination: {
        data: 'collections.episodes',
        size: 1,
        alias: 'episode',
    },

    podcastDescription: 'Подкаст «Веб-стандарты»',

    eleventyComputed: {
        permalink(data) {
            const { episode } = data;
            return `/podcast/${episode.data.episode}/`;
        },

        title(data) {
            const { episode } = data;
            return `Выпуск ${episode.data.episode}`;
        },

        preview(data) {
            return ` ${data.title}`;
        },
    },
};
