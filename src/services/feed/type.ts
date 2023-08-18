import { Pagination } from '../../types/pagination';

type FeedResponse = {
    feedID: string;
    feedName: string;
    feedUrl: string;
    feedDescription: string;
    feedCreatedAt?: Date;
    feedUpdatedAt?: Date;
};

type FeedList = {
    list: FeedResponse[];
    pagination: Pagination;
};

export { FeedResponse, FeedList };
