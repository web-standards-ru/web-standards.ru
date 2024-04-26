function clamp(min, value, max) {
    return Math.max(min, Math.min(value, max));
}

export function createPaginationModel({ eleventyData, collection, pageRange = 5 }) {
    const { pagination } = eleventyData;
    const itemsCount = collection.length;

    // пагинацию не нужно создавать, если общее число элементов в коллекции меньше или равно числа элементов на одной странице
    if (itemsCount <= pagination.size) {
        return null;
    }

    const totalPagesCount = pagination.hrefs.length;
    const pageNumber = pagination.pageNumber;
    const offset = Math.floor(pageRange / 2);

    const items = pagination.hrefs.map((url, index) => ({
        url,
        originalIndex: index,
    }));

    const startIndex = clamp(0, pageNumber - offset, totalPagesCount - pageRange);
    const endIndex = Math.min(startIndex + pageRange, itemsCount);

    const slice = items.slice(startIndex, endIndex);

    return {
        slice,
        totalPagesCount,
        previousPage: pagination.href.previous,
        nextPage: pagination.href.next,
        firstPage: pagination.href.first,
        lastPage: pagination.href.last,
        currentPageUrl: eleventyData.page.url,
        isFirstPage: pagination.hrefs[pagination.pageNumber] === pagination.href.first,
        islastPage: pagination.hrefs[pagination.pageNumber] === pagination.href.last,
        isNeedShowFirstPage: slice[0].originalIndex >= 1,
        isNeedShowFirstDivider: slice[0].originalIndex >= 2,
        isNeedShowLastPage: slice.at(-1).originalIndex < pagination.hrefs.length - 1,
        isNeedShowLastDivider: slice.at(-1).originalIndex < pagination.hrefs.length - 2,
    };
}
