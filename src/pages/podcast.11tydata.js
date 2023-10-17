const { createPaginationModel } = require('../helpers/pagination');

module.exports = {
    pagination: {
        data: 'collections.episodes',
        alias: 'episodesChunk',
        reverse: true,
        size: 10,
    },

    permalink(data) {
        const pageNumber = (data.pagination?.pageNumber ?? 0) + 1;
        return pageNumber === 1
            ? `/podcast/`
            : `/podcast/page/${pageNumber}/`;
    },

    eleventyComputed: {
        paginationModel(data) {
            const { episodes } = data.collections;

            if (episodes?.length === 0) {
                return;
            }

            return createPaginationModel({
                eleventyData: data,
                collection: episodes,
            });
        },
    },
};
