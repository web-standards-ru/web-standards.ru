export default function(eleventyConfig) {
    [
        'src/favicon.ico',
        'src/manifest.json',
        'src/fonts',
        'src/images',
        'src/{articles,people}/**/!(*11ty*)*.!(md)',
    ].forEach((path) => eleventyConfig.addPassthroughCopy(path));
};
