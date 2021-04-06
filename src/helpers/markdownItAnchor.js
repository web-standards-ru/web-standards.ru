const slugify = (s) => encodeURIComponent(String(s).trim().toLowerCase().replace(/\s+/g, '-'));

const position = {
    false: 'push',
    true: 'unshift',
};

const hasProp = Object.prototype.hasOwnProperty;

const permalinkHref = slug => `#${slug}`;
const permalinkAttrs = () => ({});

const renderPermalink = (slug, opts, state, idx) => {
    const space = () => Object.assign(new state.Token('text', '', 0), { content: ' ' });

    const linkTokens = [
        Object.assign(new state.Token('html_span', 'span', 1), {
            attrs: [
                ['class', 'tooltip'],
            ],
        }),
        Object.assign(new state.Token('html_button', 'button', 1), {
            attrs: [
                ['class', opts.permalinkClass],
                ['data-href', opts.permalinkHref(slug, state)],
                ['aria-labelledby', `copy-${slug}`],
                ['aria-label', 'Копировать ссылку на заголовок'],
                ...Object.entries(opts.permalinkAttrs(slug, state)),
            ],
        }),
        new state.Token('html_button', 'button', -1),
        Object.assign(new state.Token('html_block', 'span', 1), {
            content: `<span class="tooltip__label" role="tooltip" id="copy-${slug}">Скопировать ссылку</span>`,
        }),
        new state.Token('html_span', 'span', -1),
    ];

    // `push` or `unshift` according to position option.
    // Space is at the opposite side.
    if (opts.permalinkSpace) {
        linkTokens[position[!opts.permalinkBefore]](space());
    }
    state.tokens[idx + 1].children[position[opts.permalinkBefore]](...linkTokens);
};

const uniqueSlug = (slug, slugs) => {
    let uniq = `${slug}-1`;
    let i = 2;
    while (hasProp.call(slugs, uniq)) uniq = `${slug}-${i++}`;
    slugs[uniq] = true;
    return uniq;
};

const isLevelSelectedNumber = selection => level => level >= selection;
const isLevelSelectedArray = selection => level => selection.includes(level);

const anchor = (md, opts) => {
    opts = Object.assign({}, anchor.defaults, opts);

    md.core.ruler.push('anchor', state => {
        const slugs = {};
        const tokens = state.tokens;

        const isLevelSelected = Array.isArray(opts.level)
            ? isLevelSelectedArray(opts.level)
            : isLevelSelectedNumber(opts.level);

        tokens
            .filter(token => token.type === 'heading_open')
            .filter(token => isLevelSelected(Number(token.tag.substr(1))))
            .forEach(token => {
                // Aggregate the next token children text.
                const title = tokens[tokens.indexOf(token) + 1]
                    .children
                    .filter(token => token.type === 'text' || token.type === 'code_inline')
                    .reduce((acc, t) => acc + t.content, '');

                let slug = token.attrGet('id');

                if (slug === null) {
                    slug = uniqueSlug(opts.slugify(title), slugs);
                    token.attrPush(['id', slug]);
                }

                if (opts.permalink) {
                    opts.renderPermalink(slug, opts, state, tokens.indexOf(token));
                }

                if (opts.callback) {
                    opts.callback(token, { slug, title });
                }
            });
    });
};

anchor.defaults = {
    level: 1,
    slugify,
    permalink: false,
    renderPermalink,
    permalinkClass: 'header-anchor',
    permalinkSpace: true,
    permalinkSymbol: '¶',
    permalinkBefore: false,
    permalinkHref,
    permalinkAttrs,
};

module.exports = anchor;
