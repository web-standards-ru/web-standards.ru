import markdownIt from 'markdown-it';
import markdownItMultimdTable from 'markdown-it-multimd-table';

export default function(eleventyConfig) {
    const md = markdownIt({
        html: true,
        highlight: function(str, lang) {
            return `<pre><code tabindex="0"${lang ? ` class="language-${lang}"` : ''}>${md.utils.escapeHtml(str)}</code></pre>`;
        },
    }).use(markdownItMultimdTable);

    md.renderer.rules = { ...md.renderer.rules,
        table_close: () => '</table></div>',
        table_open: () => '<div class="content__table-wrapper"><table>',
    };

    eleventyConfig.setLibrary('md', md);
};
