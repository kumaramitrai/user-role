// eslint-disable-next-line @typescript-eslint/no-var-requires
const dotenv = require('dotenv');

dotenv.config();

// eslint-disable-next-line @typescript-eslint/no-var-requires
const config = require('config');

module.exports = {
    dev: {
        client: 'pg',
        connection: {
            host: config.get('postgres.host'),
            port: config.get('postgres.port'),
            user: config.get('postgres.user'),
            password: config.get('postgres.password'),
            database: config.get('postgres.database'),
        },
        pool: {
            min: 2,
            max: config.get('postgres.max'),
        },
        migrations: {
            tableName: 'knex_migrations',
        },
    },
};
