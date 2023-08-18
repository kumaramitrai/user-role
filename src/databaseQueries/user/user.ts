/** import packages [start] */
/** import packages [end] */

/** import custom dependency [start] */
// eslint-disable-next-line import/no-cycle
import { db } from '../connection';
import { UserTableRow } from './type';
/** import custom dependency [end] */

/**
 * Create user database query.
 * @param firstName file name
 * @param lastName lasy name
 * @param email user email
 * @param passwordHash hashed password
 * @param salt salt factor
 * @param roleId role ID
 * @returns Promise<UserTableRow>
 */
export const createUser = async (
    firstName: string,
    lastName: string,
    email: string,
    passwordHash?: string,
    salt?: string,
    role?: number,
): Promise<UserTableRow> => {
    const query = `
        INSERT INTO tbl_user(
            first_name,
            last_name,
            email,
            password,
            salt,
            role_id
        ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
    `;

    const params = [firstName, lastName, email, passwordHash, salt, role];

    const res = await db.query(query, params);

    return res.rows[0];
};

/**
 * get user database query.
 * @param email user email
 * @returns Promise<UserTableRow>
 */
export const getUserByEmail = async (email: string): Promise<UserTableRow | null> => {
    const query = `
        SELECT *
        FROM tbl_user
        WHERE email = $1
    `;
    const params = [email];
    const res = await db.query(query, params);
    return res && res.rows.length ? res.rows[0] : null;
};

/**
 * get user database query.
 * @param userID user id
 * @returns Promise<UserTableRow>
 */
export const getUserByUserId = async (userId: string): Promise<UserTableRow> => {
    const query = ` 
        SELECT tbl_user.*, roles.name
        FROM tbl_user
        LEFT JOIN roles ON roles.role_id = tbl_user.role_id
        WHERE tbl_user.user_id = $1
    `;

    const params = [userId];

    const res = await db.query(query, params);
    return res && res.rows.length ? res.rows[0] : null;
};

/**
 * get All users database query.
 * @param limit
 * @param offset
 * @returns Promise<UserTableRow>
 */
export const usersList = async (limit?: number, offset?: number): Promise<UserTableRow[]> => {
    const query = `
    SELECT tbl_user.*, roles.name
    FROM tbl_user
    LEFT JOIN roles ON roles.role_id = tbl_user.role_id
    LIMIT $1 OFFSET $2
    `;
    const params = [limit, offset];

    const res = await db.query(query, params);
    return res.rows;
};

/**
 * get user database query.
 * @param userID user id
 * @param activeStatus user status
 * @returns Promise<UserTableRow>
 */
export const updateUserRole = async (userId: string, userRole: string): Promise<UserTableRow> => {
    const query = `
    UPDATE tbl_user
    SET role_id = (
        SELECT role_id
        FROM roles
        WHERE name = $2
    )
    WHERE tbl_user.user_id = $1 returning tbl_user.user_id, tbl_user.first_name, tbl_user.last_name, tbl_user.email, 
    (SELECT name FROM roles WHERE roles.role_id = tbl_user.role_id);
    `;

    const params = [userId, userRole];
    const res = await db.query(query, params);

    return res.rows[0];
};

/**
 * get user database query.
 * @param userID user id
 * @returns Promise<void>
 */
export const deleteUser = async (userId: string, userRole?: number): Promise<UserTableRow> => {
    let condition = '';
    if (userRole) {
        condition = db.format('AND role_id = %L', userRole);
    }
    const query = `
        DELETE FROM tbl_user WHERE user_id = $1 
        ${condition}
        returning user_id
    `;

    const params = [userId];
    const res = await db.query(query, params);
    return res.rows[0];
};
