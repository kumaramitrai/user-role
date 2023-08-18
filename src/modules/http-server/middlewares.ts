import cors from 'cors';
import { expectCt, xssFilter } from 'helmet';
import { Router } from 'express';
import config from 'config';

const allowedOrigins: string[] = config.get('cors.allowedOrigins');

/**
 * Enable CORS policy on the application
 * @param router Express router object
 */
export const enableCors = (router: Router): void => {
    router.use(
        cors({
            origin: allowedOrigins,
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            preflightContinue: false,
            optionsSuccessStatus: 204,
            allowedHeaders: ['authorization', 'Authorization', 'content-type'],
        }),
    );
};

/**
 * Disable browsers' XSS filter
 * @param router Express router object
 */
export const disableXssFilter = (router: Router): void => {
    router.use(xssFilter());
};

/**
 * Enable the check for Certificate Transparency
 * @param router Express router object
 */
export const expectCtHeader = (router: Router): void => {
    router.use(
        expectCt({
            maxAge: config.get('server.headerCtMaxAge'),
            enforce: true,
        }),
    );
};
