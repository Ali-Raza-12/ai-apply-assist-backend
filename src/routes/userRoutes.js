import express from 'express';
import { updateUserProfile } from '../controllers/userController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.patch("/me", authMiddleware, updateUserProfile);



export default router