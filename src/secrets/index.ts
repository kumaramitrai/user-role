import { readFileSync } from 'fs';
import dotenv from 'dotenv';

import config from 'config';

dotenv.config();

const jwtPrivateKey = readFileSync(config.get('jwt.privatekey'), 'utf8');
const jwtPublicKey = readFileSync(config.get('jwt.publickey'), 'utf8');

export { jwtPrivateKey, jwtPublicKey };
