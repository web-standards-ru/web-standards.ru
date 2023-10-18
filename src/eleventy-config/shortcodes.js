module.exports = function(eleventyConfig) {
    // генерация псевдослучайных CSS-классов для оформления аватаров
    eleventyConfig.addShortcode('blob', function(authorName) {
        const blobColors = [1, 2, 3, 4];
        const blobShapes = [1, 2, 3, 4, 5, 6, 7];
        const shapePrefix = 'blob--shape-';
        const colorPrefix = 'blob--color-';

        const getBlobClass = (basis, array, name) => (
            name.concat(array[basis % array.length])
        );

        const shapeBasis = authorName.split('').reduce(
            (previous, current) => previous + current.charCodeAt(0), 0
        );
        const colorBasis = authorName.length;

        const colorClass = getBlobClass(colorBasis, blobColors, colorPrefix);
        const shapeClass = getBlobClass(shapeBasis, blobShapes, shapePrefix);

        return colorClass.concat(' ', shapeClass);
    });
};
