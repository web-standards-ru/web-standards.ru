const markdownIt = require('markdown-it');
const markdownItMultimdTable = require('markdown-it-multimd-table');
const markdownItAnchor = require('../libs/markdown-it-anchor.js');

module.exports = function(eleventyConfig) {
    const md = markdownIt({
        html: true,
        highlight: function(str, lang) {
            return `<pre><code tabindex="0"${lang ? ` class="language-${lang}"` : ''}>${md.utils.escapeHtml(str)}</code></pre>`;
        },
    }).use(markdownItAnchor, {
        permalink: true,
        permalinkClass: 'tooltip__button',
        permalinkSymbol: '',
        permalinkSpace: false,
        slugify: () => 'section',
    }).use(markdownItMultimdTable);

    md.renderer.rules = { ...md.renderer.rules,
        table_close: () => '</table></div>',
        table_open: () => '<div class="content__table-wrapper"><table>',
    };

    eleventyConfig.setLibrary('md', md);
};
