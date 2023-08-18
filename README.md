# Express Project Setup
npm init

# Install Dependencies
npm i bcryptjs config cors cookie-parser dotenv express helmet@5.1.1 joi jsonwebtoken knex morgan multer node-pg-format pg nanoid@3.3.5 uuid winston

# Install devDependencies
npm i -D @types/bcrypt @types/bcryptjs @types/config @types/cookie-parser @types/cors @types/express @types/joi @types/morgan @types/jsonwebtoken @types/morgan @types/multer @types/node @types/pg @types/uuid @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-airbnb-base eslint-config-prettier eslint-import-resolver-typescript eslint-plugin-import eslint-plugin-prettier nodemon prettier ts-node typescript

# Setup postgreSQL in local
<!-- After successful installation of postgreSQL login using terminal -->
sudo -u postgres psql
<!-- create database -->
create database assignment;
<!-- create user -->
create user adminuser with encrypted password 'Ha7@l@UspUgonus';
<!-- grant all acces to user -->
ALTER USER adminuser WITH SUPERUSER;
<!-- Connect to database you created -->
\c assignment;


# Typescript configuration
npx tsc --init

# Knex Js (SQL query builder) configuration
<!-- install knex js in computer locally -->
npm install knex -g 
<!-- install knex js in project as well -->
npm install knex --save // currently do not need as we have already installed in dependecies
<!-- create Knexfile.js -->
knex init  (will create knexfile.js in root directory)
<!-- create initial migration  -->
knex migrate:make initial_schema -x ts
<!-- Run initial migration to create tables in Database  -->
knex migrate:latest --env dev
<!-- Run migration down to remove tables from Database  -->
knex migrate:down --env dev

# Knex configuration
npm run dev

# Generate public key & private key

<!-- Generate the private key -->
openssl genrsa -out ./src/secrets/privateKey.pem 2048

<!-- Generate the public key -->
openssl rsa -in ./src/secrets/privateKey.pem -pubout -out ./src/secrets/publicKey.pem