const Typograf = require('typograf');

const privateLabel = '\uF000';
// Узкий неразрывный пробел для сокращений т.д. и т.п.
Typograf.addRules([
    {
        name: 'ru/nnbsp/abbr',
        handler: function(text) {
            function abbr($0, $1, $2, $3) {
                // дд.мм.гггг
                if ($2 === 'дд' && $3 === 'мм') {
                    return $0;
                }

                // Являются ли сокращения ссылкой
                if (
                    ['рф', 'ру', 'рус', 'орг', 'укр', 'бг', 'срб'].indexOf($3) >
                    -1
                ) {
                    return $0;
                }

                return $1 + $2 + '.' + '\u202F' + $3 + '.';
            }

            const re = new RegExp(
                `(^|\\s|${privateLabel})([а-яё]{1,3})\\. ?([а-яё]{1,3})\\.`,
                'g',
            );

            return (
                text
                    .replace(re, abbr)
                    // Для тройных сокращений - а.е.м.
                    .replace(re, abbr)
            );
        },
    },
]);
const typograf = new Typograf({
    locale: [`ru`],
});
typograf.enableRule('ru/nnbsp/abbr');
typograf.disableRule('ru/nbsp/abbr');

module.exports = {
    settings: {
        commonmark: true,
        emphasis: '_',
        strong: '*',
        bullet: '-',
        incrementListMarker: true,
        listItemIndent: 'mixed',
        fences: true,
    },
    plugins: [
        'remark-frontmatter',
        ['remark-lint-emphasis-marker'],
        ['remark-lint-strong-marker'],
        ['remark-lint-unordered-list-marker-style', '-'],
        ['remark-lint-ordered-list-marker-value', 'ordered'],
        ['remark-lint-code-block-style', 'fenced'],
        [
            '@mavrin/remark-typograf',
            {
                typograf,
                keywords: [':(', 'TL;DR'],
                builtIn: false,
            },
        ],
    ],
};
