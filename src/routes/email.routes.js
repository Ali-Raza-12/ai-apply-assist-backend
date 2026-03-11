import express from 'express'
import { createEmail, sendApplicationEmail } from "../controllers/email.controller.js"
import { authMiddleware } from '../middlewares/authMiddleware.js';


const router = express.Router();

router.post('/generate', authMiddleware, createEmail)
router.post("/send", authMiddleware, sendApplicationEmail)

export default router;