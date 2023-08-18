export declare namespace Responses {
    type UUIDv4 = string;
    type VerifyToken = {
        payload: {
            userId: UUIDv4;
            userEmail: string;
            iat: number;
            exp: number;
            aud: string;
        };
    };
    type JwtToken = string;
}
