exports.up = async (knex) => {
    await knex.raw(`
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        CREATE TABLE roles (
            role_id SERIAL PRIMARY KEY,
            name VARCHAR(20) NOT NULL
        );

        CREATE TABLE tbl_user(
            user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            first_name VARCHAR(200) NOT NULL,
            last_name VARCHAR(200) NOT NULL,
            role_id INT NOT NULL,
            email VARCHAR(200) NOT NULL,
            password VARCHAR(500) NOT NULL,
            salt VARCHAR(500) NOT NULL,
            created_at TIMESTAMP NOT NULL DEFAULT now(),
            updated_at TIMESTAMP NOT NULL DEFAULT now(),
            FOREIGN KEY(role_id) REFERENCES roles(role_id) ON DELETE CASCADE
        );
       
        CREATE TABLE tbl_feed(
            feed_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            feed_name VARCHAR(200) NOT NULL,
            feed_url VARCHAR(200) NOT NULL,
            feed_description VARCHAR(200) NOT NULL,
            feed_created_at TIMESTAMP NOT NULL DEFAULT now(),
            feed_updated_at TIMESTAMP NOT NULL DEFAULT now()
        );

        CREATE TABLE user_feed_access (
            user_feed_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL UNIQUE,
            feed_id UUID NOT NULL UNIQUE,
            can_delete BOOLEAN DEFAULT false,
            FOREIGN KEY(user_id) REFERENCES tbl_user(user_id) ON DELETE CASCADE,
            FOREIGN KEY(feed_id) REFERENCES tbl_feed(feed_id) ON DELETE CASCADE
        );
        
    `);
    await knex('roles').insert([
        { name: 'superadmin' },
        { name: 'admin' },
        { name: 'basic' }
    ]);
   
};

exports.down = async (knex) => {
    await knex.raw(`
        DROP TABLE user_feed_access;
        DROP TABLE tbl_user;
        DROP TABLE roles;
        DROP TABLE tbl_feed;
    `);
};
