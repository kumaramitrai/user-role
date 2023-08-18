/**
 * To override configs in config directory with .env file,
 * we need to import "dotenv" module first, initialize it and then import "config" module.
 * So here import sequence matters.
 */
import dotenv from 'dotenv';

dotenv.config();

import config from 'config';
import { HTTPServer } from './modules/http-server';
import { db } from './databaseQueries';

const httpServer = new HTTPServer({
    port: config.get('server.port'),
    reconnect: true,
});

/**
 * to initialise and set multiple services
 */
const initializeServices = async (): Promise<void> => {
    /** connects to the database */
    await db.connection();
    /** starts the server */
    await httpServer.initialize();
};

initializeServices();
