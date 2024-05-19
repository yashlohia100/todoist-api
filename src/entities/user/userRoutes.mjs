import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getMe,
  getUser,
  getUsers,
  updateUser,
} from './userController.mjs';
import { protect } from '../auth/authController.mjs';

// Mounted on '/api/users'
const userRouter = Router();

// Protect all routes below
// userRouter.use(protect);

userRouter.get('/me', protect, getMe);

// '/api/users/'
userRouter.route('/').get(getUsers).post(createUser);

// '/api/users/:userId'
userRouter.route('/:userId').get(getUser).patch(updateUser).delete(deleteUser);

export default userRouter;
