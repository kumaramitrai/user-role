/** import custom dependency [start] */
import { ROLE } from '../../constants/user';
import { FeedList, FeedResponse } from './type';
import * as feedQueries from '../../databaseQueries/feed/feed';
import { FeedTableRow } from '../../databaseQueries/feed/type';
import { limitOffsetPageNumber } from '../../utils/pagination';
/** import custom dependency [end] */

/**
 * Takes in tbl_feed's row and generates the file response.
 * @param row tbl_feed row
 * @returns FeedResponse
 */
const generateFeedResponse = (row: FeedTableRow): FeedResponse => {
    return {
        feedID: row.feed_id,
        feedName: row.feed_name,
        feedUrl: row.feed_url,
        feedDescription: row.feed_description,
        feedCreatedAt: row.feed_created_at,
        feedUpdatedAt: row.feed_updated_at,
    };
};

/**
 * register feed
 * @param feedName feed Name
 * @param feedUrl feed Url
 * @param feedDescription feed Description
 * @returns Promise<FeedResponse>
 */
const createFeed = async (feedName: string, feedUrl: string, feedDescription: string): Promise<FeedResponse> => {
    const result = await feedQueries.createFeed(feedName, feedUrl, feedDescription);
    return generateFeedResponse(result);
};

/**
 * get feed detail by feed ID
 * @param feedID feed ID
 * @returns Promise<FeedResponse | null>
 */
const getFeedByFeedId = async (feedID: string): Promise<FeedResponse | null> => {
    const result = await feedQueries.getFeedByFeedId(feedID);
    if (!result) {
        return null;
    }

    return generateFeedResponse(result);
};

/**
 * get feed all feed list
 * @returns Promise<FeedList>
 */
const feedList = async (page?: string, size?: string): Promise<FeedList> => {
    const { limit, offset, pageNumber } = limitOffsetPageNumber(page, size);

    const result = await feedQueries.feedList(limit, offset);

    const total = (await feedQueries.feedList()).length;

    const list: FeedResponse[] = result.map((row) => generateFeedResponse(row));

    const data: FeedList = {
        pagination: {
            page: pageNumber,
            size: limit,
            total,
        },
        list,
    };

    return data;
};
/**
 * update feed role
 * @param feedID feed ID
 * @param userRole feed role
 * @returns Promise<FeedList>
 */
const updateFeed = async (feedID: string, feedUrl: string, feedDescription: string): Promise<FeedResponse> => {
    const result = await feedQueries.updateFeed(feedID, feedUrl, feedDescription);
    // console.log('result', result);

    return generateFeedResponse(result);
};
/**
 * update feed role
 * @param feedID feed ID
 * @param userRole feed role
 * @returns Promise<FeedList>
 */
const deleteFeed = async (feedID: string, userRole?: number): Promise<FeedResponse> => {
    const result = await feedQueries.deleteFeed(feedID, userRole);

    return generateFeedResponse(result);
};

/**
 * grant permission to feed
 * @param userID user ID
 * @param feedID feed ID
 * @param canDelete boolen
 * @returns Promise<FeedList>
 */
const grantFeed = async (userID: string, feedID: string, canDelete: boolean): Promise<FeedResponse> => {
    const result = await feedQueries.grantAccesss(userID, feedID, canDelete);

    return generateFeedResponse(result);
};
/**
 * revoke feed permission
 * @param userID user ID
 * @param feedID feed ID
 * @returns Promise<FeedList>
 */
const revokeFeedPermission = async (userID: string, feedID: string): Promise<FeedResponse> => {
    const result = await feedQueries.revokeFeedPermission(userID, feedID);

    return generateFeedResponse(result);
};

/**
 * revoke feed permission
 * @param userID user ID
 * @param feedID feed ID
 * @returns Promise<FeedList>
 */
const getFeedDetail = async (userID: string, feedID: string): Promise<any> => {
    const result = await feedQueries.getFeedDetail(userID, feedID);

    return generateFeedResponse(result);
};

export {
    createFeed,
    getFeedByFeedId,
    updateFeed,
    deleteFeed,
    feedList,
    grantFeed,
    revokeFeedPermission,
    getFeedDetail,
};
