module.exports = function(eleventyConfig) {
    // Настройка Markdown
    require('#eleventy-config/markdown-library.js')(eleventyConfig);

    // Коллекции
    require('#eleventy-config/collections.js')(eleventyConfig);

    // Фильтры
    require('#eleventy-config/filters.js')(eleventyConfig);

    // Трансформации
    require('#eleventy-config/transforms.js')(eleventyConfig);

    // Теги
    require('#eleventy-config/shortcodes.js')(eleventyConfig);

    // Копирование
    require('#eleventy-config/static-files.js')(eleventyConfig);

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
        templateFormats: [
            'md',
            'njk',
        ],
    };
};
