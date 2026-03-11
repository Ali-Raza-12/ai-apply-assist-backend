import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { uploadCV, removeCV } from '../controllers/cv.controller.js';
import { uploadCVMiddleware } from "../middlewares/uploadMiddleware.js"

const router = express.Router();

router.post("/", authMiddleware, uploadCVMiddleware.single('cv'),  uploadCV);
router.delete("/", authMiddleware, removeCV);

export default router;