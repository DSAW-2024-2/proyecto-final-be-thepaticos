import { Router } from 'express';
import userController from '../controllers/user.js';
import { upload } from '../middlewares/uploadImages.js';
import { verifyUserID } from '../middlewares/existsDocuments.js';
const userRouter = Router();

userRouter.get('/', userController.getUserByToken);
userRouter.get('/:id', verifyUserID, userController.getUserByID);
userRouter.patch('/:id', verifyUserID, upload, userController.patchUser);
userRouter.get('/:id/rides', verifyUserID, userController.getUserRides);
userRouter.patch('/:id/rides', verifyUserID, userController.patchUserRides);

export default userRouter;
