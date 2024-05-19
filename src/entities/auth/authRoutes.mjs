import { Router } from 'express';
import { login, logout, signup } from './authController.mjs';

// Mounted on '/api/auth'
const authRouter = Router();

// '/api/auth/signup'
authRouter.post('/signup', signup);

// '/api/auth/login'
authRouter.post('/login', login);

// '/api/auth/logout'
authRouter.get('/logout', logout);

export default authRouter;
