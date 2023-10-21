const path = require('node:path');
const htmlmin = require('html-minifier');
const prettydata = require('pretty-data');
const { parseHTML } = require('linkedom');
const Image = require('@11ty/eleventy-img');
const sharp = require('sharp');

Image.concurrency = require('os').cpus().length;

const isProdMode = process.env.NODE_ENV === 'production';

async function processImage({ imageElement, inputPath, options, attributes }) {
    const imageStats = await Image(inputPath, {
        filenameFormat: (hash, src, width, format) => {
            const extension = path.extname(src);
            const name = path.basename(src, extension);
            return `${hash}-${name}-${width}.${format}`;
        },
        ...options,
    });

    const imageAttributes = Object.assign(
        {},
        attributes ?? {},
        Object.fromEntries(
            [...imageElement.attributes].map((attr) => [attr.name, attr.value])
        )
    );

    const tempElement = imageElement.ownerDocument.createElement('div');
    tempElement.innerHTML = Image.generateHTML(imageStats, imageAttributes);

    // Задаём размеры сами, так как для Gif они вычисляются некорректно
    // https://github.com/11ty/eleventy-img/pull/182
    const sharpImageMetaData = await sharp(inputPath).metadata();
    const width = imageElement.getAttribute('width') ?? sharpImageMetaData.width;
    const height = imageElement.getAttribute('height') ?? sharpImageMetaData.pageHeight ?? sharpImageMetaData.height;
    const newImage = tempElement.querySelector('img');
    Object.assign(newImage, { width, height });

    imageElement.replaceWith(tempElement.firstElementChild);
}

module.exports = function(eleventyConfig) {
    // преобразование контентных изображений
    eleventyConfig.addTransform('optimizeContentImages', async function(content) {
        if (!this.page.inputPath.includes('/articles/')) {
            return content;
        }

        if (!this.page.outputPath.endsWith('.html')) {
            return content;
        }

        const { document } = parseHTML(content);
        const images = Array.from(document.querySelectorAll('.article__content img'))
            .filter((image) => !image.src.match(/^https?:/));

        if (images.length === 0) {
            return content;
        }

        const articleSourceFolder = path.dirname(this.page.inputPath);
        const outputArticleImagesFolder = path.join(path.dirname(this.page.outputPath), 'images');

        await Promise.all(images.map(async(image) => {
            const fullImagePath = path.join(articleSourceFolder, image.src);
            const isGif = path.extname(fullImagePath) === '.gif';

            await processImage({
                document,
                imageElement: image,
                inputPath: fullImagePath,
                options: {
                    widths: ['auto', 600, 1200, 2400],
                    // `sharp`, на данный момент, не поддерживает анимированный avif
                    formats: isProdMode && !isGif
                        ? ['svg', 'avif', 'webp', 'auto']
                        : ['svg', 'webp', 'auto'],
                    outputDir: outputArticleImagesFolder,
                    urlPath: 'images/',
                    svgShortCircuit: true,
                    sharpOptions: {
                        animated: true,
                    },
                },
                attributes: {
                    loading: 'lazy',
                    decoding: 'async',
                    sizes: [
                        '(min-width: 1920px) calc((1920px - 2 * 64px) * 5 / 8 - 2 * 16px)',
                        '(min-width: 1240px) calc((100vw - 2 * 64px) * 5 / 8 - 2 * 16px)',
                        '(min-width: 700px) calc(700px - 2 * 16px)',
                        'calc(100vw - 2 * 16px)',
                    ].join(','),
                },
            });
        }));

        return document.toString();
    });

    // преобразование аватаров
    eleventyConfig.addTransform('optimizeAvatarImages', async function(content) {
        if (!this.page.outputPath.endsWith?.('.html')) {
            return content;
        }

        const { document } = parseHTML(content);
        const images = Array.from(document.querySelectorAll('.blob__photo'))
            .filter((image) => !image.src.match(/^https?:/));

        if (images.length === 0) {
            return content;
        }

        await Promise.all(images.map(async(image) => {
            const fullImagePath = path.join(eleventyConfig.dir.input, image.src);
            const avatarsOutputFolder = path.dirname(path.join(eleventyConfig.dir.output, image.src));

            await processImage({
                imageElement: image,
                inputPath: fullImagePath,
                options: {
                    widths: image.sizes
                        .split(',')
                        .flatMap((entry) => {
                            entry = entry.split(/\s+/).at(-1);
                            entry = parseFloat(entry);
                            return [entry, entry * 2];
                        }),
                    formats: isProdMode
                        ? ['svg', 'avif', 'webp', 'auto']
                        : ['svg', 'webp', 'auto'],
                    outputDir: avatarsOutputFolder,
                    urlPath: image.src.split('/').slice(0, -1).join('/'),
                    svgShortCircuit: true,
                },
            });
        }));

        return document.toString();
    });

    if (isProdMode) {
        eleventyConfig.addTransform('htmlmin', (content, outputPath) => {
            if (outputPath && outputPath.endsWith('.html')) {
                let result = htmlmin.minify(
                    content, {
                        removeComments: true,
                        collapseWhitespace: true,
                        collapseBooleanAttributes: true,
                    }
                );
                return result;
            }
            return content;
        });

        eleventyConfig.addTransform('xmlmin', function(content, outputPath) {
            if (outputPath && outputPath.endsWith('.xml')) {
                let result = prettydata.pd.xmlmin(content);
                return result;
            }
            return content;
        });
    }

    eleventyConfig.addTransform('lazyYouTube', (content, outputPath) => {
        let articles = /articles\/([a-zA-Z0-9_-]+)\/index\.html/i;
        let iframes = /<iframe src="https:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9_-]+)"(.*?)><\/iframe>/ig;

        if (outputPath && outputPath.match(articles)) {
            content = content.replace(iframes, (match, p1) => {
                return `
                    <div class="video">
                        <a class="video__link" href="https://youtu.be/${p1}">
                            <picture>
                                <source srcset="https://img.youtube.com/vi/${p1}/maxresdefault.jpg" media="(min-width: 736px)">
                                <img class="video__media" src="https://img.youtube.com/vi/${p1}/mqdefault.jpg" alt="">
                            </picture>
                        </a>
                        <button class="video__button" type="button" aria-label="Запустить видео">
                            <svg width="68" height="48" viewBox="0 0 68 48"><path class="video__button-shape" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"></path><path class="video__button-icon" d="M 45,24 27,14 27,34"></path></svg>
                        </button>
                    </div>`;
            });
        }
        return content;
    });
};
