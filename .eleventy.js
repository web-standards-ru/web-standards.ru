module.exports = function(config) {
    config.addPassthroughCopy('src/favicon.ico');
    config.addPassthroughCopy('src/manifest.json');
    config.addPassthroughCopy('src/fonts');
    config.addPassthroughCopy('src/images');
    config.addPassthroughCopy('src/styles');
    config.addPassthroughCopy('src/scripts');
    config.addPassthroughCopy('src/{articles,people}/**/*.!(md)');

    // Markdown Options

    const markdownItAnchor = require('./src/helpers/markdown-it-anchor.js');

    const md = require('markdown-it')({
        html: true,
        highlight: function (str, lang) {
            return `<pre><code tabindex="0"${lang ? ` class="language-${lang}"` : ''}>${md.utils.escapeHtml(str)}</code></pre>`;
        },
    }).use(markdownItAnchor, {
        permalink: true,
        permalinkClass: 'tooltip__button',
        permalinkSymbol: '',
        permalinkSpace: false,
        permalinkAttrs: () => ({
            'aria-label': 'Этот заголовок',
        }),
        slugify: () => 'section',
    }).use(require('markdown-it-multimd-table'));

    md.renderer.rules = { ...md.renderer.rules,
        table_close: () => "</table></div>",
        table_open: () => '<div class="content__table-wrapper"><table>',
    };

    config.setLibrary('md', md);

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
    config.addCollection('episodes', () => {
        const { getEpisodesData } = require('./src/helpers/podcasts-service');
        return getEpisodesData();
    });

    config.addCollection('people', (collectionAPI) => {
        return collectionAPI.getFilteredByGlob('src/people/*/*.md');
    });

    config.addCollection('articles', (collectionAPI) => {
        return collectionAPI.getFilteredByGlob('src/articles/*/*.md');
    });

    config.addFilter('limit', (array, limit) => {
        return array.slice(0, limit);
    });

    config.addFilter('addHyphens', (content, maxLength = 0) => {
        if (!content || content.length <= maxLength) {
            return content;
        }
        let hyphenLibRu = require('hyphen/ru');
        let contentWithHyps = hyphenLibRu.hyphenateSync(content);
        return contentWithHyps;
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

    config.addFilter('addLoadingLazy', (content) => {
        content.replace(/<img(?!.*loading)/g, '<img loading="lazy"');
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

    config.addTransform('lazyYouTube', (content, outputPath) => {
        let articles = /articles\/([a-zA-Z0-9_-]+)\/index\.html/i;
        let iframes = /\<iframe src\=\"https\:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9_-]+)\"(.*?)\>\<\/iframe>/ig;

        if (outputPath && outputPath.match(articles)) {
            content = content.replace(iframes, (match, p1) => {
                return `
                    <div class="video">
                        <a class="video__link" href="https://youtu.be/${p1}">
                            <picture>
                                <source srcset="https://img.youtube.com/vi/${p1}/maxresdefault.jpg" media="(min-width: 736px)">
                                <img class="video__media" src="https://img.youtube.com/vi/${p1}/mqdefault.jpg" alt="">
                            </picture>
                        </a>
                        <button class="video__button" type="button" aria-label="Запустить видео">
                            <svg width="68" height="48" viewBox="0 0 68 48"><path class="video__button-shape" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"></path><path class="video__button-icon" d="M 45,24 27,14 27,34"></path></svg>
                        </button>
                    </div>`
            });
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
