/** import packages [start] */
import express from 'express';
/** import packages [end] */

/** import custom dependency [start] */
import userController from '../controller/v1/user';
import { registerUserSchema, loginUserSchema, paginationSchema, editUserRoleSchema, deleteUserSchema } from '../validations/schemas';
import validate from '../validations/validate';
import { enableCors } from '../modules/http-server/middlewares';
import authenticationMiddleware from '../middlewares/authentication';
/** import custom dependency [end] */

const router = express.Router({ mergeParams: true });

enableCors(router);

router.post('/register', authenticationMiddleware, validate(registerUserSchema), userController.register);
router.post('/login', validate(loginUserSchema), userController.login);
router.get('/', authenticationMiddleware, validate(paginationSchema, 'query'), userController.usersList);
router.put('/:userID', authenticationMiddleware, validate(editUserRoleSchema), userController.updateUserRole);
router.delete('/:userID', authenticationMiddleware, validate(deleteUserSchema, 'params'), userController.deleteUser);

export default router;
