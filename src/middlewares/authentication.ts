/* eslint-disable require-atomic-updates */
/** import package [start] */
import { Request, Response, NextFunction } from 'express';
import { decode } from 'jsonwebtoken';
import { Responses } from './types';
/** import package [start] */

/** import custom dependency [start] */
import { USER_TYPE } from '../constants';
import { APIError } from '../modules/http-server/responseHandler';
import Logger from '../utils/logger';
/** import custom dependency [start] */

/** logger for debugging */
const logger = new Logger(module, 'AuthenticationMiddleware');

/**
 * to authentiacte a user by fetching the bearer jwt token from body or auth header
 * @param req express request object
 * @param res express response object
 * @param next express next function
 */

/**
 *
 * to authenticate a user by fetching the bearer jwt token from body or auth header
 * @param resource Resource
 * @returns (req: Request, res: Response, next: NextFunction) => Promise<void>
 */
const authenticationMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        /**
         * In case authorization header is declared inside body
         */
        if (req.body && req.body.headers && req.body.headers.authorization) {
            req.headers.authorization = req.body.headers.authorization;
        }
        /**
         * looking for Bearer token from authorization header assuming that it is
         * formatted in standard method e.i. "Bearer <token>"
         */
        if (
            req.headers.authorization &&
            req.headers.authorization.split(' ')[0] === 'Bearer' &&
            req.headers.authorization.split(' ')[1].trim()
        ) {
            /** return response from verifyToken method */
            const accessToken = req.headers.authorization.split(' ')[1].trim();
            /**
             * if the auth-service is enabled or not, if not then simply decode the access token without signature check.
             * Note: Done for the development purpose
             */

            const result: Responses.VerifyToken = {
                payload: decode(accessToken) as {
                    userId: string;
                    userEmail: string;
                    iat: number;
                    exp: number;
                    aud: string;
                },
            };
            if (typeof result.payload !== 'object' || !result.payload) {
                throw APIError.unauthorized('INVALID_TOKEN');
            }

            const { userId, userEmail, aud } = result.payload;

            req.user = { userId, email: userEmail, userType: aud };
            const { userType } = req.user;
            // Check the user's role.
            const allowedRoles = [USER_TYPE.SUPERADMIN, USER_TYPE.ADMIN];
            if (!allowedRoles.includes(+userType)) {
                throw APIError.unauthorized(`you doesn't have permission to access this API method`);
            }
            next();
        } else {
            throw APIError.unauthorized('Authorization Header missing');
        }
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

export default authenticationMiddleware;
