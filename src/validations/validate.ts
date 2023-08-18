import { NextFunction, Request, Response } from 'express';
import { ObjectSchema, ValidationError } from 'joi';
import { HTTP_STATUS_CODES } from '../constants';

/**
 * Middleware to check and validate request body
 * @param {ObjectSchema} schema validation schema
 */

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const validate = (schema: ObjectSchema, reqProperty: 'body' | 'query' | 'params' | 'all' = 'body') => {
    if (!schema) {
        throw new Error(`'${schema}' does not exist`);
    }

    // eslint-disable-next-line func-names
    return async function (req: Request, res: Response, next: NextFunction) {
        try {
            const dataToVerify = reqProperty === 'all' ? req: req[reqProperty];
            await schema.validateAsync(dataToVerify, {
                abortEarly: false,
                stripUnknown: true,
                allowUnknown: false,
            });

            next();
        } catch (error) {
            if (error instanceof ValidationError) {
                return res.status(HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY).json({
                    success: false,
                    errors: error.message,
                });
            }
            next(error);
        }
    };
};

export default validate;
