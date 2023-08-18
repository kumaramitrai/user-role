import { nanoid } from 'nanoid';
import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import { jwtPrivateKey, jwtPublicKey } from '../secrets';
import { JWTTokens, AccessTokenClaims, RefreshTokenClaims } from '../interfaces/token';

const generateTokens = (userId: string, userEmail:string, role?: number): JWTTokens => {
    const accessTokenOptions: SignOptions = {
        algorithm: 'RS512',
        subject: userId,
        audience: role?.toString(),
        expiresIn: '120s', // 2 minutes
    };
    const accessToken = jwt.sign({userId, userEmail}, jwtPrivateKey, accessTokenOptions);

    // unique jti for refresh token
    const jti = nanoid();

    const refreshTokenOptions: SignOptions = {
        algorithm: 'RS512',
        subject: userId,
        audience: role?.toString(),
        expiresIn: '120s', // 10 days
    };

    const refreshToken = jwt.sign({ jti }, jwtPrivateKey, refreshTokenOptions);

    const tokens: JWTTokens = {
        accessToken,
        refreshToken,
    };

    return tokens;
};

const verifyAccessToken = (accessToken: string): AccessTokenClaims | null => {
    try {
        const options: VerifyOptions = {
            algorithms: ['RS512'],
        };
        const decodedToken = jwt.verify(accessToken, jwtPublicKey, options) as AccessTokenClaims;
        return decodedToken;
    } catch (error) {
        // Token verification failed
        return null;
    }
};

const verifyRefreshToken = (refreshToken: string): RefreshTokenClaims | null => {
    try {
        const options: VerifyOptions = {
            algorithms: ['RS512'],
        };
        const decodedToken = jwt.verify(refreshToken, jwtPublicKey, options) as RefreshTokenClaims;
        return decodedToken;
    } catch (error) {
        // Token verification failed
        return null;
    }
};

export { generateTokens, verifyAccessToken, verifyRefreshToken };
