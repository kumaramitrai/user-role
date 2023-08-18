import { Server } from 'http';
import express, { Express } from 'express';
import morgan from 'morgan';
import Logger from '../../utils/logger';
import { disableXssFilter, enableCors, expectCtHeader } from './middlewares';
import { Options } from './type';
import { apiErrorHandler, routeErrorHandler } from './responseHandler';
import router from '../../routes';
import createSuperAdmin from '../superAdmin';

const logger = new Logger(module, 'http-server');

export class HTTPServer {
    private app: Express;

    private retryServerListen = false;

    private server: Server | null = null;

    private readonly port: number = 1947;

    constructor(options?: Options) {
        this.app = express();
        if (options && options.reconnect) this.retryServerListen = options.reconnect;
        if (options && options.port) this.port = options.port;
        this.app.use(morgan('combined'));
        this.app.use((req, res, next) => {
            logger.debug('statusCode', res.statusCode);
            next();
        });
        // enable cors
        enableCors(this.app);
        this.app.use(express.json({ limit: '100mb' }));
        this.app.use(router);
        this.app.use(apiErrorHandler);
        this.app.use(routeErrorHandler);
        // add security headers
        disableXssFilter(this.app);
        expectCtHeader(this.app);
        // create super admin @ server startup
        // createSuperAdmin();
    }

    initialize(): Promise<void> {
        return new Promise((resolve) => {
            this.server = this.app.listen(this.port, () => {
                logger.info('Server started on port', this.port);
                resolve();
            });
            this.server.timeout = 15 * 60 * 1000; // 15 mins
        });
    }

    closeServer(): void {
        if (this.server) this.server.close();
    }
}

export default HTTPServer;
