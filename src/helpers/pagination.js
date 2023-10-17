function createPaginationModel({ eleventyData, collection, pageRange }) {
    const { pagination } = eleventyData;
    const itemsCount = collection.length;
    const pageNumber = pagination.pageNumber;

    const offset = Math.floor(pageRange / 2);

    const items = pagination.hrefs.map((url, index) => ({
        url,
        originalIndex: index,
    }));

    const startIndex = Math.max(0, pageNumber - offset);
    const endIndex = Math.min(startIndex + pageRange, itemsCount);

    const slice = items.slice(startIndex, endIndex);

    return {
        slice,
        totalPagesCount: pagination.hrefs.length,
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

module.exports = {
    createPaginationModel,
};
