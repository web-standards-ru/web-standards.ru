module.exports = function(config) {
    config.addPassthroughCopy('src/favicon.ico');
    config.addPassthroughCopy('src/fonts');
    config.addPassthroughCopy('src/styles');
    config.addPassthroughCopy('src/scripts');

    config.addCollection('tagList', (collection) => {
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

    config.addFilter('limit', (array, limit) => {
        return array.slice(0, limit);
    });

    config.addFilter('filterIndexArticles', (array) => {
        const featured = array.find((item) => item.data.featured);
        let notFeatured = [];
        for (let i = 0; notFeatured.length < 4; i++) {
            if (!array[i].data.featured) {
                notFeatured.push(array[i]);
            }
        }
        return [featured, ...notFeatured];
    });

    config.addFilter('filterArticles', (array) => {
        return array.filter(post =>
            post.inputPath.startsWith('./src/articles/')
        );
    });

    config.addFilter('filterCurrentPage', (array, page) => {
        return array.filter(post =>
            post.url != page.url
        );
    });

    config.addFilter('filterArticleTag', (tagsCollection) => {
        return tagsCollection.filter(tag => tag !== 'article');
    });

    config.addFilter('ruDate', (value) => {
        return value.toLocaleString('ru', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).replace(' г.', '');
    });

    config.addFilter('shortDate', (value) => {
        return value.toLocaleString('ru', {
            month: 'short',
            day: 'numeric'
        }).replace('.', '');
    });

    config.addFilter('isoDate', (value) => {
        return value.toISOString();
    });

    config.addFilter('htmlmin', (value) => {
        let htmlmin = require('html-minifier');
        return htmlmin.minify(
            value, {
                removeComments: true,
                collapseWhitespace: true
            }
        );
    });

    config.addFilter('markdown', (value) => {
        let markdown = require('markdown-it')({
            html: true
        });
        return markdown.render(value);
    });

    config.addTransform('xmlmin', (content, outputPath) => {
        if(outputPath && outputPath.endsWith('.xml')) {
            let prettydata = require('pretty-data');
            return prettydata.pd.xmlmin(content);
        }
        return content;
    });

    // Возвращает данные о людях из списка filterList
    config.addFilter('filterPeople', (peopleList, filterList) => {
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

    config.addNunjucksTag('blob', (nunjucksEngine) => {
        return new function () {
            this.tags = ['blob'];

            this.parse = function (parser, nodes, lexer) {
                const token = parser.nextToken();

                const arguments = parser.parseSignature(null, true);
                parser.advanceAfterBlockEnd(token.value);

                return new nodes.CallExtensionAsync(this, 'run', arguments);
            };

            this.run = function (context, authorName, callback) {
                const blobColors = ['teal', 'lightteal', 'moss', 'grass'];
                const blobShapes = [1, 2, 3, 4, 5, 6, 7];
                const shapePrefix = 'blob--shape-';
                const colorPrefix = 'blob--';

                const getBlobClass = (basis, array, name) => (
                    name.concat(array[basis % array.length])
                );

                const shapeBasis = authorName.split('').reduce(
                    (previous, current) => previous + current.charCodeAt(0), 0
                );
                const colorBasis = authorName.length;

                const colorClass = getBlobClass(colorBasis, blobColors, colorPrefix);
                const shapeClass = getBlobClass(shapeBasis, blobShapes, shapePrefix);

                callback(
                    null, new nunjucksEngine.runtime.SafeString(
                        colorClass.concat(' ', shapeClass)
                    )
                );
            };
        }();
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
