import yaml from 'js-yaml';

export default async function(eleventyConfig) {
    eleventyConfig.addDataExtension('yml', (contents) => {
        return yaml.load(contents);
    });
}
