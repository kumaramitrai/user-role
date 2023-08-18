import { Pagination } from '../../types/pagination';

type UserResponse = {
    userID: string;
    firstName: string;
    lastName: string;
    userEmail: string;
    userRoleID?: number;
    userRole?: string;
    userPassword?: string;
    userSalt: string;
    userCreatedAt?: Date;
    userUpdatedAt?: Date;
};

type UserList = {
    list: UserResponse[];
    pagination: Pagination;
};

export { UserResponse, UserList };
