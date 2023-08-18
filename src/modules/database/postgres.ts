import pg, { PoolConfig } from 'pg';
import { format } from 'node-pg-format';
import Logger from '../../utils/logger';

const logger = new Logger(module, 'PostgreSQL');

export interface QueryFunction {
    (pgClient: pg.PoolClient): Promise<void>;
}

class Postgres {
    private readonly pool: pg.Pool;

    constructor(options?: PoolConfig) {
        this.pool = new pg.Pool(options);
    }

    /**
     * Allows execution of queries with internal managment of client connection.
     * @param queryString query formatted for placeholder based execution
     * @param parameters Array of parameters which shall be passed in placeholders
     * @returns Result of the query
     */
    query = async (
        queryString: string,
        parameters?: (string | number | Date | JSON | boolean | unknown)[],
    ): Promise<pg.QueryResult<any>> => {
        try {
            const client = await this.pool.connect();
            const queryResult = await client.query(queryString, parameters);
            client.release();
            return queryResult;
        } catch (error) {
            logger.error('Failed fetching query result', error);
            throw error;
        }
    };

    /**
     * This function takes a pre-created client object to execute query,
     * but does not release query. Helpful for transaction based execution
     * where one client shall execute all queries.
     * @param client passing already created client object
     * @param queryString query formatted for placeholder based execution
     * @param parameters Array of parameters which shall be passed in placeholders
     * @returns Result of the query
     */
    queryByClient = async (
        client: pg.PoolClient,
        queryString: string,
        parameters?: (string | number | Date | JSON | boolean | unknown)[],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): Promise<pg.QueryResult<any>> => {
        try {
            const queryResult = await client.query(queryString, parameters);
            return queryResult;
        } catch (error) {
            logger.error('Failed fetching query result', error);
            throw error;
        }
    };

    /**
     * Allows database transaction commitment in a managed way
     * where the passed function can perform queries as needed.
     * @param queryFunction Function which makes use of connection client and resolves or
     * rejects promise to signal rollback and connection release.
     */
    transaction = async (queryFunction: QueryFunction): Promise<void> => {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');
            await queryFunction(client);
            await client.query('COMMIT');
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
    };

    connection = (): any =>
        this.pool
            .connect()
            .then(() => logger.info('Connected to postgres database'))
            .catch((err) => {
                logger.error('Error connecting to the database:', err);
                process.exit(-1);
            });

    /**
     * to get a formated query by passing placeholder
     * along side preventing injection attack
     * @param query query formatted for placeholder based execution
     * @param args function arguments which shall be passed in placeholders
     * @returns final formatted query
     */
    format = (query: string, ...args: any[]): string => format(query, ...args);
}

export default Postgres;
