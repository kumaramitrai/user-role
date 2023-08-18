import config from 'config';
import Postgres from '../modules/database/postgres';

// eslint-disable-next-line import/prefer-default-export
export const db = new Postgres(config.get('postgres'));
