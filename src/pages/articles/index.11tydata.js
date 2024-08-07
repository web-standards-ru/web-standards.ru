import { createPaginationModel } from '../../libs/pagination.js';

export default {
    pagination: {
        data: 'collections.articles',
        reverse: true,
        size: 10,
    },

    permalink(data) {
        const pageNumber = (data.pagination?.pageNumber ?? 0) + 1;
        return pageNumber === 1
            ? `/articles/`
            : `/articles/page/${pageNumber}/`;
    },

    eleventyComputed: {
        paginationModel(data) {
            const { articles } = data.collections;

            if (articles?.length === 0) {
                return;
            }

            return createPaginationModel({
                eleventyData: data,
                collection: articles,
            });
        },

        articlesGroupsByYears: function(data) {
            const articles = data.pagination.items;

            const articlesByYear = articles.reduce((articlesGroups, article) => {
                const year = new Date(article.date).getFullYear();
                articlesGroups[year] = articlesGroups[year] || [];
                articlesGroups[year].push(article);
                return articlesGroups;
            }, {});

            const groups = Object.entries(articlesByYear).map(([year, articles]) => {
                articles.sort((a, b) => b.data.date - a.data.date);

                return {
                    year,
                    articles,
                };
            });

            groups.sort((a, b) => b.year - a.year);

            return groups;
        },
    },
};
