import express from 'express';
import { updateUserProfile } from '../controllers/userController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.put("/update-profile", authMiddleware, updateUserProfile);

export default router