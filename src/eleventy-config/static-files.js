export default function(eleventyConfig) {
    [
        'src/favicon.ico',
        'src/manifest.json',
        'src/fonts',
        'src/images',
        'src/styles',
        'src/scripts',
        'src/{articles,people}/**/*.!(md)',
    ].forEach((path) => eleventyConfig.addPassthroughCopy(path));
};
