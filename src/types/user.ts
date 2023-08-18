/**
 * type declaration of decoded user payload comes from auth service
 * at the time of verification of access jwt token.
 */
type DecodedUserPayload = {
    email: string;
    userId: string;
    userType: string;
};
type User = {
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

export { DecodedUserPayload, User };
