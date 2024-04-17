import { getEpisodesData } from '../libs/podcasts-service.js';

export default function(eleventyConfig) {
    eleventyConfig.addCollection('tagList', (collection) => {
        const set = new Set();
        for (const item of collection.getAllSorted()) {
            if ('tags' in item.data) {
                let tags = item.data.tags;
                if (typeof tags === 'string') {
                    tags = [tags];
                }
                for (const tag of tags) {
                    set.add(tag);
                }
            }
        }
        return [...set].sort();
    });

    /*
        Коллекция для выпусков подкаста.
        Формат данных одного выпуска:
        - episode
        - title
        - date
        - chapters
            - time
            - title
        - content
        - hosts
        - audio
    */
    eleventyConfig.addCollection('episodes', () => {
        return getEpisodesData();
    });

    eleventyConfig.addCollection('people', (collectionAPI) => {
        return collectionAPI.getFilteredByGlob('src/people/*/*.md');
    });

    eleventyConfig.addCollection('articles', (collectionAPI) => {
        return collectionAPI.getFilteredByGlob('src/articles/*/*.md');
    });
};
