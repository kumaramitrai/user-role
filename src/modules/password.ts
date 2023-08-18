import crypto from 'crypto';

interface HashPassword {
    passwordHash: string;
    salt: string;
}

const hashPassword = (plainPassword: string): HashPassword => {
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = crypto.pbkdf2Sync(plainPassword, salt, 1000, 64, 'sha512').toString('hex');

    return {
        passwordHash,
        salt,
    };
};

const matchPassword = (plainPassword: string, salt: string, passwordHash?: string ): boolean => {
    const hash = crypto.pbkdf2Sync(plainPassword, salt, 1000, 64, 'sha512').toString('hex');
    return passwordHash === hash;
};

export { hashPassword, matchPassword };
