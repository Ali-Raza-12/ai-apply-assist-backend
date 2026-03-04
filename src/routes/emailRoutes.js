import express from 'express'
import { createEmail } from "../controllers/emailController.js"
import { authMiddleware } from '../middlewares/authMiddleware.js';


const router = express.Router();

router.post('/generate-email', authMiddleware, createEmail)

export default router;