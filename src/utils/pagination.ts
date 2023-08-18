type LimiOffsetPageNumber = {
    limit: number;
    offset: number;
    pageNumber: number;
};

/**
 * takes in page and size as parameters and returns limit, offset and pageNumber
 * @param page
 * @param size
 * @returns LimiOffsetPageNumber
 */
const limitOffsetPageNumber = (page: string | undefined, size: string | undefined): LimiOffsetPageNumber => {
    let limit: number;
    if (size) {
        limit = Number.parseInt(size, 10);
    } else {
        limit = 10;
    }

    let pageNumber: number;
    if (page) {
        pageNumber = Number.parseInt(page, 10);
    } else {
        pageNumber = 1;
    }

    const offset = (pageNumber - 1) * limit;

    return {
        limit,
        offset,
        pageNumber,
    };
};

export { limitOffsetPageNumber };
