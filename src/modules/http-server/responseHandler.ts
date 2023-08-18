import { NextFunction, Request, Response } from 'express';
import { ValidationError } from 'joi';
import { HTTP_STATUS_CODES } from '../../constants';

/**
 * Handles API errors.
 * @param code error code
 * @param message error message
 * @param details error details
 */
class APIError extends Error {
    code: number;

    details: string | undefined;

    constructor(code: number, message: string, details?: string) {
        super(message);

        this.name = Error.name;
        this.code = code;
        this.details = details;
        Error.captureStackTrace(this);
    }

    static badRequest(details?: string): APIError {
        const message = 'Bad request';
        return new APIError(HTTP_STATUS_CODES.BAD_REQUEST, message, details);
    }

    static unauthorized(details?: string): APIError {
        const message = 'Unauthorized';
        return new APIError(HTTP_STATUS_CODES.UNAUTHORIZED, message, details);
    }

    static notFound(details?: string): APIError {
        const message = 'Not found';
        return new APIError(HTTP_STATUS_CODES.NOT_FOUND, message, details);
    }

    static forbidden(details?: string): APIError {
        const message = 'Forbidden';
        return new APIError(HTTP_STATUS_CODES.FORBIDDEN, message, details);
    }

    static conflict(details?: string): APIError {
        const message = 'Conflict';
        return new APIError(HTTP_STATUS_CODES.CONFLICT, message, details);
    }

    static unprocessableEntity(details?: string): APIError {
        const message = 'Unprocessable Entity';
        return new APIError(HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY, message, details);
    }

    static badGateway(details?: string): APIError {
        const message = 'Bad gateway';
        return new APIError(HTTP_STATUS_CODES.BAD_GATEWAY, message, details);
    }

    static internalServerError(details?: string): APIError {
        const message = 'Internal server error';
        return new APIError(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR, message, details);
    }
}

/**
 * Route error handler
 */
const routeErrorHandler = (req: Request, res: Response, next: NextFunction): Response => {
    return res.status(HTTP_STATUS_CODES.NOT_FOUND).json({
        error: {
            reason: 'Not found',
            details: `route '${req.path}' not found`,
        },
    });
};

/**
 *
 * Expressjs error handler
 */
const apiErrorHandler = (err: any, req: Request, res: Response, next: NextFunction): Response | undefined => {
    if (err instanceof ValidationError) {
        return res.status(HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY).json({
            error: {
                reason: 'Validation Error',
                details: err.details,
            },
        });
    }

    if (err instanceof APIError) {
        res.status(err.code).json({
            error: {
                reason: err.message,
                details: err.details,
            },
        });
        return;
    }

    res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: {
            reason: err.message,
        },
    });
};

/**
 * Send data in response to the client.
 * @param {any} data Data object
 * @param {Response} res Express response object
 */
const sendDataResponse = (data: unknown, res: Response): void => {
    res.status(HTTP_STATUS_CODES.OK).json({
        success: true,
        data,
    });
};

export { APIError, routeErrorHandler, apiErrorHandler, sendDataResponse };
