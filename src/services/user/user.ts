/** import custom dependency [start] */
import { ROLE } from '../../constants/user';
import { UserList, UserResponse } from './type';
import * as userQueries from '../../databaseQueries/user/user';
import { UserTableRow } from '../../databaseQueries/user/type';
import { number } from 'joi';
import { limitOffsetPageNumber } from '../../utils/pagination';
import { APIError } from '../../modules/http-server/responseHandler';
/** import custom dependency [end] */

/**
 * Takes in tbl_file's row and generates the file response.
 * @param row tbl_file row
 * @returns FileResponse
 */
const generateUserResponse = (row: UserTableRow): UserResponse => {
    return {
        userID: row.user_id,
        firstName: row.first_name,
        lastName: row.last_name,
        userEmail: row.email,
        userRoleID: row.role_id,
        userRole: row.name,
        userPassword: row.password,
        userSalt: row.salt,
        userCreatedAt: row.created_at,
        userUpdatedAt: row.updated_at,
    };
};

/**
 * register user
 * @param firstName first Name of User
 * @param lastName last Name of User
 * @param email user email
 * @param salt salt factor
 * @param passwordHash hashed password
 * @param role user's role
 * @returns Promise<UserResponse>
 */
const createUser = async (
    firstName: string,
    lastName: string,
    email: string,
    salt: string,
    passwordHash?: string,
    role?: number,
): Promise<UserResponse> => {
    if (!role) {
        role = ROLE.BASIC;
    }
    const result = await userQueries.createUser(firstName, lastName, email, passwordHash, salt, role);
    return generateUserResponse(result);
};

/**
 * get user details by email ID
 * @param email user email
 * @returns Promise<UserResponse | null>
 */
const getUserByEmail = async (email: string): Promise<UserResponse | null> => {
    const result = await userQueries.getUserByEmail(email);
    if (!result) {
        return null;
    }

    return generateUserResponse(result);
};

/**
 * get user detail by iuser ID
 * @param userId user ID
 * @returns Promise<UserResponse | null>
 */
const getUserByUserId = async (userId: string): Promise<UserResponse | null> => {
    const result = await userQueries.getUserByUserId(userId);
    if (!result) {
        return null;
    }

    return generateUserResponse(result);
};

/**
 * get user all user list
 * @returns Promise<UserList>
 */
const usersList = async (page?: string, size?: string): Promise<UserList> => {
    const { limit, offset, pageNumber } = limitOffsetPageNumber(page, size);

    const result = await userQueries.usersList(limit, offset);

    const total = (await userQueries.usersList()).length;

    const list: UserResponse[] = result.map((row) => generateUserResponse(row));

    const sanitizedResult = list.map(({ userRoleID, userPassword, ...rest }) => rest);

    const data: UserList = {
        pagination: {
            page: pageNumber,
            size: limit,
            total,
        },
        list: sanitizedResult,
    };

    return data;
};
/**
 * update user role
 * @param userId user ID
 * @param userRole user role
 * @returns Promise<UserList>
 */
const updateUserRole = async (userId: string, userRole: string): Promise<UserResponse> => {
    
    const result = await userQueries.updateUserRole(userId, userRole);
    // console.log('result', result);
    
    return generateUserResponse(result);
};
/**
 * update user role
 * @param userId user ID
 * @param userRole user role
 * @returns Promise<UserList>
 */
const deleteUser = async (userId: string, userRole?: number): Promise<UserResponse> => {
    
    const result = await userQueries.deleteUser(userId, userRole);
    
    return generateUserResponse(result);
};


export { createUser, getUserByEmail, getUserByUserId, updateUserRole, deleteUser, usersList };
