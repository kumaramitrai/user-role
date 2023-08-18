type UserSessionTableRow = {
    user_id: string;
    access_token?: string;
    refresh_token?: string;
    session_created_at?: Date;
    session__updated_at?: Date;
};

type UserTableRow = {
    user_id: string;
    first_name: string;
    last_name: string;
    role_id: number;
    name:string;
    email: string;
    password: string;
    salt: string;
    created_at?: Date;
    updated_at?: Date;
};



export { UserSessionTableRow, UserTableRow };
