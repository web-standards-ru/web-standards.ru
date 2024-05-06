export default async function(eleventyConfig) {
    // Настройка Markdown
    (await import('./src/eleventy-config/markdown-library.js')).default(eleventyConfig);

    // Коллекции
    (await import('./src/eleventy-config/collections.js')).default(eleventyConfig);

    // Фильтры
    (await import('./src/eleventy-config/filters.js')).default(eleventyConfig);

    // Трансформации
    (await import('./src/eleventy-config/transforms.js')).default(eleventyConfig);

    // Теги
    (await import('./src/eleventy-config/shortcodes.js')).default(eleventyConfig);

    // Копирование
    (await import('./src/eleventy-config/static-files.js')).default(eleventyConfig);

    // Расширения
    (await import('./src/eleventy-config/extensions.js')).default(eleventyConfig);

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
            '11ty.js',
        ],
    };
};
