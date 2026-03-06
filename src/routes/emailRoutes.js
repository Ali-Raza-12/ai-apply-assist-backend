import express from 'express'
import { createEmail, sendApplicationEmail } from "../controllers/emailController.js"
import { authMiddleware } from '../middlewares/authMiddleware.js';


const router = express.Router();

router.post('/generate-email', authMiddleware, createEmail)
router.post("/send-email", authMiddleware, sendApplicationEmail)

export default router;