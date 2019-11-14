module.exports = function(config) {
    config.addPassthroughCopy('src/favicon.ico');
    config.addPassthroughCopy('src/fonts');
    config.addPassthroughCopy('src/styles');
    config.addPassthroughCopy('src/scripts');

    config.addCollection('tagList', function(collection) {
        const set = new Set();
        for (const item of collection.getAllSorted()) {
            if ('tags' in item.data) {
                const tags = item.data.tags;
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

    config.addFilter('filterArticles', function(array) {
        return array.filter(post =>
            post.inputPath.startsWith('./src/articles/')
        );
    });
    config.addFilter('filterArticleTag', function(tagsCollection) {
        return tagsCollection.filter(tag => tag !== 'article');
    });

    config.addFilter('ruDate', function(value) {
        return value.toLocaleString('ru', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).replace(' г.', '');
    });

    config.addFilter('isoDate', function(value) {
        return value.toISOString();
    });

    config.addFilter('htmlmin', function(value) {
        let htmlmin = require('html-minifier');
        return htmlmin.minify(
            value, {
                removeComments: true,
                collapseWhitespace: true
            }
        );
    });

    config.addFilter('markdown', function(value) {
        let markdown = require('markdown-it')({
            html: true
        });
        return markdown.render(value);
    });

    config.addTransform('xmlmin', function(content, outputPath) {
        if(outputPath && outputPath.endsWith('.xml')) {
            let prettydata = require('pretty-data');
            return prettydata.pd.xmlmin(content);
        }
        return content;
    });

    // Возвращает данные о людях из списка filterList
    config.addFilter('filterPeople', function(peopleList, filterList) {
        return peopleList
            .filter((person) => {
                // Иногда filterList это строка, а не массив, поэтому всегда делаем массив
                const filterListNormalized = [].concat(filterList);

                return filterListNormalized.includes(person.fileSlug);
            })
            .map((person) => {
                // Берёт все данные, кроме pkg и collections для оптимизации памяти
                const { pkg, collections, ...data } = person.data;

                return data;
            });
    });

    return {
        dir: {
            input: 'src',
            output: 'dist',
            includes: 'includes',
            layouts: 'layouts',
        },
        dataTemplateEngine: 'njk',
        markdownTemplateEngine: false,
        htmlTemplateEngine: 'njk',
        passthroughFileCopy: true,
        templateFormats: [
            'md', 'html', 'njk',
            'jpg', 'png', 'svg',
        ],
    };
};
