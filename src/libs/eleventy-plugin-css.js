import * as lightningcss from 'lightningcss';
import browserslist from 'browserslist';

export default function(eleventyConfig, options = {}) {
    const formats = options.formats ?? ['css'];

    eleventyConfig.addTemplateFormats(formats);

    eleventyConfig.addExtension(formats, {
        outputFileExtension: 'css',

        read: false,

        compileOptions: {
            permalink() {
                return (data) => {
                    return data.permalink;
                };
            },

            cache: true,
        },

        async compile(inputContent, inputPath) {
            if (typeof options.filter === 'function' && !options.filter(inputContent, inputPath)) {
                return;
            }

            const bundleResult = await lightningcss.bundleAsync({
                targets: lightningcss.browserslistToTargets(browserslist(options.targets)),
                filename: inputPath,
                sourceMap: true,
                ...(options.lightningcss || {}),
            });

            const map = JSON.parse(bundleResult.map.toString());
            const dependencies = map.sources;
            this.addDependencies(inputPath, dependencies);

            return async function() {
                return bundleResult.code;
            };
        },
    });
}
