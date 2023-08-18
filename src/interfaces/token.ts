export interface JWTTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AccessTokenClaims {
    iat: number;
    exp: number;
    aud: string;
    sub: string;
}

export interface RefreshTokenClaims extends AccessTokenClaims {
    jti: string;
}
