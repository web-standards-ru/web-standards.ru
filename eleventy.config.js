module.exports = function(eleventyConfig) {
    // Настройка Markdown
    require('./src/eleventy-config/markdown-library.js')(eleventyConfig);

    // Коллекции
    require('./src/eleventy-config/collections.js')(eleventyConfig);

    // Фильтры
    require('./src/eleventy-config/filters.js')(eleventyConfig);

    // Трансформации
    require('./src/eleventy-config/transforms.js')(eleventyConfig);

    // Теги
    require('./src/eleventy-config/shortcodes.js')(eleventyConfig);

    // Копирование
    require('./src/eleventy-config/static-files.js')(eleventyConfig);

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
