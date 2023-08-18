/** import packages [start] */
import { NextFunction, Request, Response } from 'express';
/** import packages [end] */

/** import custom dependency [start] */
import { APIError, sendDataResponse } from '../../modules/http-server/responseHandler';
import * as userService from '../../services/user/user';
import { hashPassword, matchPassword } from '../../modules/password';
import { generateTokens } from '../../modules/jwt';
import Logger from '../../utils/logger';
import { ROLE, USER_TYPE } from '../../constants/user';
/** import custom dependency [end] */

const logger = new Logger(module, 'UserController');

/**
 * register user
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 * @returns Promise<void>
 */
const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userType } = req.user;

        if (+userType !== USER_TYPE.SUPERADMIN && +userType !== USER_TYPE.ADMIN) {
            throw APIError.unauthorized(`you don't have access`);
        }
        const { firstName, lastName, email, password } = req.body;

        let { role } = req.body;
        if (+userType === USER_TYPE.SUPERADMIN) {
            if (!role) {
                role = ROLE.BASIC;
            } else if (role === 'admin' || role === 2 || role === '2') {
                role = ROLE.ADMIN;
            } else if (role === 'superadmin' || role === 1 || role === '1') {
                // if someone tries to send super admin role id (1) in request body
                throw APIError.unprocessableEntity();
            }
        } else if (+userType === USER_TYPE.ADMIN) {
            if (!role) {
                role = ROLE.BASIC;
            } else if (role === 'admin' || role === 2 || role === '2') {
                throw APIError.unprocessableEntity();
            } else if (role === 'superadmin' || role === 1 || role === '1') {
                // if someone tries to send super admin role id (1) in request body
                throw APIError.unprocessableEntity();
            }
        }
        // check if user with this email is already registered
        const existingUserWithEmail = await userService.getUserByEmail(email);
        if (existingUserWithEmail) {
            throw APIError.conflict(`email ${email} is already registered`);
        }

        const hashedPassword = hashPassword(password);
        const { passwordHash } = hashedPassword;
        const { salt } = hashedPassword;

        /*
         * registration init
         * create new user
         */
        const createdUser = await userService.createUser(firstName, lastName, email, salt, passwordHash, role);
        delete createdUser.userPassword;
        delete createdUser.userRole;
        return sendDataResponse(createdUser, res);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};
/**
 * login user
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 * @returns Promise<any>
 */
const login = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const { email, password } = req.body;

        const user = await userService.getUserByEmail(email);
        if (!user) {
            throw APIError.notFound(`user with email ${email} is not found`);
        }

        /* match password */
        const matched = matchPassword(password, user.userSalt, user?.userPassword);
        if (!matched) {
            throw APIError.notFound('invalid details');
        }

        /* generate tokens */
        const tokens = generateTokens(user.userID.toString(), user.userEmail, user.userRoleID);
        if (!tokens) {
            return APIError.internalServerError();
        }

        return sendDataResponse(tokens, res);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

/**
 * get all users
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 * @returns Promise<void>
 */
const usersList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { page, size } = req.query as any;

        const user = await userService.usersList(page, size);
        if (!user) {
            throw APIError.notFound(`No Users Found`);
        }

        return sendDataResponse(user, res);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

/**
 * get all users
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 * @returns Promise<void>
 */
const updateUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userType } = req.user;
        const { userID } = req.params;
        const { userRole } = req.body;

        if (+userType !== USER_TYPE.SUPERADMIN) {
            throw APIError.unauthorized(`you don't have access`);
        }

        const user = await userService.getUserByUserId(userID);

        if (!user) {
            throw APIError.notFound(`user not found`);
        }
        const result = await userService.updateUserRole(user.userID, userRole);
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
 * get all users
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 * @returns Promise<void>
 */
const deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { userType } = req.user;
        const { userID } = req.params;
        if (+userType !== USER_TYPE.SUPERADMIN && +userType !== USER_TYPE.ADMIN) {
            throw APIError.unauthorized(`you don't have access`);
        }

        const user = await userService.getUserByUserId(userID);

        if (!user) {
            throw APIError.notFound(`user not found`);
        }
        let userRole;
        if (+userType === USER_TYPE.SUPERADMIN) {
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
        }

        const result = await userService.deleteUser(user.userID, userRole);
        if (!result) {
            throw APIError.internalServerError();
        }

        return sendDataResponse(result, res);
    } catch (error) {
        logger.error(error);
        next(error);
    }
};

export default {
    register,
    login,
    usersList,
    updateUserRole,
    deleteUser,
};
