import express from 'express';
// import { getCurrentUser, loginUser, resgisterUser, updatePassword, updateProfile } from '../controllers/userController.js';
import { getCurrentUser, loginUser, registerUser, updatePassword, updateProfile } from '../controllers/userController.js';

import authMiddleware from '../middleware/auth.js';

const userRouter = express.Router();

// Public links
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

// Private links
userRouter.get('/me', authMiddleware, getCurrentUser);
userRouter.get('/profile', authMiddleware, updateProfile);
userRouter.get('/password', authMiddleware, updatePassword);

export default userRouter; // default export
