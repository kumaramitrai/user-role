/** import packages [start] */
/** import packages [end] */

/** import custom dependency [start] */
// eslint-disable-next-line import/no-cycle
import { db } from '../connection';
import { FeedTableRow } from './type';
/** import custom dependency [end] */

/**
 * Create feed database query.
 * @param feedName feed name
 * @param feedUrl feed url
 * @param feedDescription feed description
 * @returns Promise<FeedTableRow>
 */
export const createFeed = async (feedName: string, feedUrl: string, feedDescription: string): Promise<FeedTableRow> => {
    const query = `
        INSERT INTO tbl_feed(
            feed_name,
            feed_url,
            feed_description
        ) VALUES ($1, $2, $3) RETURNING *
    `;

    const params = [feedName, feedUrl, feedDescription];

    const res = await db.query(query, params);

    return res.rows[0];
};

/**
 * get feed database query.
 * @param feedID feed id
 * @returns Promise<FeedTableRow>
 */
export const getFeedByFeedId = async (feedId: string): Promise<FeedTableRow> => {
    const query = ` 
        SELECT *
        FROM tbl_feed
        WHERE tbl_feed.feed_id = $1
    `;

    const params = [feedId];

    const res = await db.query(query, params);
    return res && res.rows.length ? res.rows[0] : null;
};

/**
 * get All feeds database query.
 * @param limit
 * @param offset
 * @returns Promise<FeedTableRow>
 */
export const feedList = async (limit?: number, offset?: number): Promise<FeedTableRow[]> => {
    const query = `
    SELECT *
    FROM tbl_feed
    LIMIT $1 OFFSET $2
    `;
    const params = [limit, offset];

    const res = await db.query(query, params);
    return res.rows;
};

/**
 * get feed database query.
 * @param feedID feed id
 * @param feedUrl feed url
 * @param feedDescription feed Description
 * @returns Promise<FeedTableRow>
 */
export const updateFeed = async (feedID: string, feedUrl: string, feedDescription: string): Promise<FeedTableRow> => {
    const query = `
    UPDATE tbl_feed
    SET feed_url = $2, feed_description = $3 
    WHERE feed_id = $1 
    returning *
    `;

    const params = [feedID, feedUrl, feedDescription];
    const res = await db.query(query, params);

    return res.rows[0];
};

/**
 * get feed database query.
 * @param feedID feed id
 * @param userRole user role
 * @returns Promise<void>
 */
export const deleteFeed = async (feedID: string, userRole?: number): Promise<FeedTableRow> => {
    let condition = '';
    if (userRole) {
        condition = db.format('AND role_id = %L', userRole);
    }
    const query = `
        DELETE FROM tbl_feed WHERE feed_id = $1 
        ${condition}
        returning feed_id
    `;

    const params = [feedID];
    const res = await db.query(query, params);
    return res.rows[0];
};

/**
 * get feed database query.
 * @param userID user id
 * @param feedID feed id
 * @param canDelete delete access
 * @returns Promise<void>
 */
export const grantAccesss = async (userID: string, feedID: string, canDelete: boolean): Promise<FeedTableRow> => {
    const query = `
    INSERT INTO user_feed_access (user_id, feed_id, can_delete) VALUES ($1, $2, $3) returning *
    `;
    const params = [userID, feedID, canDelete];
    const res = await db.query(query, params);
    return res.rows[0];
};

/**
 * get feed database query.
 * @param userID user id
 * @param feedID feed id
 * @returns Promise<void>
 */
export const revokeFeedPermission = async (userID: string, feedID: string): Promise<FeedTableRow> => {
    const query = `
    DELETE FROM user_feed_access WHERE user_id = $1 AND feed_id = $2 returning *
    `;
    const params = [userID, feedID];
    const res = await db.query(query, params);
    return res.rows[0];
};

/**
 * get feed database query.
 * @param userID user id
 * @param feedID feed id
 * @returns Promise<void>
 */
export const getFeedDetail = async (userID: string, feedID: string): Promise<FeedTableRow> => {
    const query = `
    SELECT can_delete FROM user_feed_access WHERE user_id = $1 AND feed_id = $2 returning *
    `;
    const params = [userID, feedID];
    const res = await db.query(query, params);
    return res.rows[0];
};
