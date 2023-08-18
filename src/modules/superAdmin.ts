import { User } from '../types/user';
import { hashPassword } from './password';
import { createUser, getUserByEmail } from '../databaseQueries/user/user';

async function createSuperAdmin() {
    try {
        const password = 'admin@1234';
        const hashedPassword = hashPassword(password);
        const { passwordHash } = hashedPassword;
        const { salt } = hashedPassword;

        const superAdmin: User = {
            firstName: 'superadmin',
            lastName: 'superadmin',
            userRoleID: 1,
            userEmail: 'superadmin@yopmail.com',
            userPassword: passwordHash,
            userSalt: salt,
        };

        // Check if the super-admin user already exists
        const existingSuperAdmin = await getUserByEmail(superAdmin.userEmail);

        if (!existingSuperAdmin) {
            // Create the super-admin user
            const result = await createUser(
                superAdmin.firstName,
                superAdmin.lastName,
                superAdmin.userEmail,
                superAdmin.userPassword,
                superAdmin.userSalt,
                superAdmin.userRoleID,
            );
            if (result) {
                console.log('Super-admin user created successfully');
            }
        } else {
            console.log('Super-admin user already exists');
        }
    } catch (error) {
        console.error('Error creating super-admin user:', error);
    }
}

export default createSuperAdmin;