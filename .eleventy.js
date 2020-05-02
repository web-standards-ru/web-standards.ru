module.exports = function(config) {
    config.addPassthroughCopy('src/favicon.ico');
    config.addPassthroughCopy('src/manifest.json');
    config.addPassthroughCopy('src/fonts');
    config.addPassthroughCopy('src/styles');
    config.addPassthroughCopy('src/scripts');
    config.addPassthroughCopy('src/**/*.(html|gif|jpg|png|svg|zip)');

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

    config.addFilter('filterLastArticles', (array) => {
        let lastElement = [];
        lastElement.push(array[array.length - 1]);
        return lastElement;
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
        return tagsCollection.filter(
            tag => (
                tag !== 'article' &&
                tag !== 'people'
            )
        );
    });

    config.addFilter('filterPeople', (peopleList, filterList) => {
        return peopleList
            .filter((person) => {
                // Иногда filterList это строка, а не массив, поэтому всегда делаем массив
                const filterListNormalized = [].concat(filterList);

                return filterListNormalized.includes(person.fileSlug);
            })
            .map((person) => {
                return person.data;
            });
    });

    config.addFilter('fixLinks', (content) => {
        const reg = /(src="[^(https:\/\/)])|(src="\/)|(href="[^(https:\/\/)])|(href="\/)/g;
        const prefix = `https://web-standards.ru` + content.url;
        return content.templateContent.replace(reg, (match) => {
            if (match === `src="/` || match === `href="/`) {
                match = match.slice(0, -1);
                return match + prefix;
            } else {
                return match.slice(0, -1) + prefix + match.slice(-1);
            }
        });
    });

    config.addFilter('mapToYears', (articlesList) => {
        const articlesByYear = {};
        articlesList.forEach((article) => {
            const year = new Date(article.date).getFullYear();
            if (!articlesByYear[year]) {
                articlesByYear[year] = [];
            }
            articlesByYear[year].push(article);
        });
        return Object.getOwnPropertyNames(articlesByYear).map((year) => {
            return {
                year,
                articles: articlesByYear[year],
            };
        });
    });

    // Даты

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

    config.addFilter('markdown', (value) => {
        let markdown = require('markdown-it')({
            html: true
        });
        return markdown.render(value);
    });

    // Трансформации

    config.addTransform('htmlmin', (content, outputPath) => {
        if(outputPath && outputPath.endsWith('.html')) {
            let htmlmin = require('html-minifier');
            let result = htmlmin.minify(
                content, {
                    removeComments: true,
                    collapseWhitespace: true
                }
            );
            return result;
        }
        return content;
    });

    config.addTransform('xmlmin', function(content, outputPath) {
        if(outputPath && outputPath.endsWith('.xml')) {
            let prettydata = require('pretty-data');
            let result = prettydata.pd.xmlmin(content);
            return result;
        }
        return content;
    });

    // Теги

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
                const blobColors = [1, 2, 3, 4];
                const blobShapes = [1, 2, 3, 4, 5, 6, 7];
                const shapePrefix = 'blob--shape-';
                const colorPrefix = 'blob--color-';

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
            data: 'data',
        },
        dataTemplateEngine: 'njk',
        markdownTemplateEngine: false,
        htmlTemplateEngine: 'njk',
        passthroughFileCopy: true,
        templateFormats: [
            'md', 'njk'
        ],
    };
};
