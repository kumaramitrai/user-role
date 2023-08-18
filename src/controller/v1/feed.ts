/** import packages [start] */
import { NextFunction, Request, Response } from 'express';
/** import packages [end] */

/** import custom dependency [start] */
import { APIError, sendDataResponse } from '../../modules/http-server/responseHandler';
import * as feedService from '../../services/feed/feed';
import * as userService from '../../services/user/user';
import Logger from '../../utils/logger';
import { ROLE, USER_TYPE } from '../../constants/user';
/** import custom dependency [end] */

const logger = new Logger(module, 'FeedController');

/**
 * create feed
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 * @returns Promise<void>
 */
const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userType } = req.user;

        const { feedName, feedUrl, feedDescription } = req.body;

        if (+userType !== USER_TYPE.SUPERADMIN) {
            throw APIError.unauthorized(`you don't have access`);
        }

        /* create new feed */
        const createdFeed = await feedService.createFeed(feedName, feedUrl, feedDescription);
        if (!createdFeed) {
            throw APIError.internalServerError();
        }

        return sendDataResponse(createdFeed, res);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

/**
 * get all feeds
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 * @returns Promise<void>
 */
const feedList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userType } = req.user;

        const { page, size } = req.query as any;

        if (+userType !== USER_TYPE.SUPERADMIN) {
            throw APIError.unauthorized(`you don't have access`);
        }

        const feed = await feedService.feedList(page, size);
        if (!feed) {
            throw APIError.notFound(`No Users Found`);
        }

        return sendDataResponse(feed, res);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

/**
 * update feeds
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 * @returns Promise<void>
 */
const updateFeed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userType } = req.user;
        const { feedID } = req.params;
        const { feedUrl, feedDescription } = req.body;

        if (+userType !== USER_TYPE.SUPERADMIN) {
            throw APIError.unauthorized(`you don't have access`);
        }

        const feed = await feedService.getFeedByFeedId(feedID);

        if (!feed) {
            throw APIError.notFound(`feed not found`);
        }
        const result = await feedService.updateFeed(feed.feedID, feedUrl, feedDescription);
        if (!result) {
            throw APIError.internalServerError();
        }

        return sendDataResponse(result, res);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

/**
 * get all feeds
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 * @returns Promise<void>
 */
const deleteFeed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userType } = req.user;
        const { feedID } = req.params;
        if (+userType !== USER_TYPE.SUPERADMIN) {
            throw APIError.unauthorized(`you don't have access`);
        }

        const feed = await feedService.getFeedByFeedId(feedID);

        if (!feed) {
            throw APIError.notFound(`feed not found`);
        }
        let userRole;
        /* if (+userType === USER_TYPE.SUPERADMIN) {
            if (user.userRoleID === 1) {
                throw APIError.unprocessableEntity();
            }
            userRole;
        } else if (+userType === USER_TYPE.ADMIN) {
            if (user.userRoleID === 1) {
                throw APIError.unprocessableEntity();
            }
            if (user.userRoleID === 2) {
                throw APIError.unauthorized(`you don't have access`);
            } else {
                userRole = user.userRoleID;
            }
        } */

        const result = await feedService.deleteFeed(feed.feedID, userRole);
        if (!result) {
            throw APIError.internalServerError();
        }

        return sendDataResponse(result, res);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

export const grantFeedAccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user;
        const { userID, feedID, canDelete } = req.body;
        // Check if the user has superadmin role

        const userRoleResult = await userService.getUserByUserId(userId);
        if (!userRoleResult || userRoleResult.userRoleID !== 1) {
            throw APIError.unauthorized(`Permission denied`);
        }

        // // Insert or update permission
        const result = await feedService.grantFeed(userID, feedID, canDelete);

        return sendDataResponse(result, res);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

export const revokeFeedAccess = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.user;
        const { userID, feedID } = req.body;
        // Check if the user has superadmin role
        const userRoleResult = await userService.getUserByUserId(userId);
        if (!userRoleResult || userRoleResult.userRoleID !== 1) {
            throw APIError.unauthorized(`Permission denied`);
        }

        // Revoke permission
        const result = await feedService.revokeFeedPermission(userID, feedID);

        return sendDataResponse(result, res);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

/**
 * get all feeds
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 * @returns Promise<void>
 */
const getFeedDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { feedID } = req.params;
        const { userId } = req.user;
        // Check if the user has access to the feed
        const accessResult = await feedService.getFeedDetail(userId, feedID);
        if (!accessResult) {
            throw APIError.unauthorized(`Unauthorized`);
        }
        const canDelete = accessResult.canDelete;
        // Fetch the feed details
        const feedResult = await feedService.getFeedByFeedId(feedID);
        if (!feedResult) {
            throw APIError.notFound(`feed not found`);
        }
        const feed = {
            canDelete,
            feedResult
        };
        return sendDataResponse(feed, res);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

export default {
    create,
    feedList,
    updateFeed,
    deleteFeed,
    grantFeedAccess,
    revokeFeedAccess,
    getFeedDetail,
};
