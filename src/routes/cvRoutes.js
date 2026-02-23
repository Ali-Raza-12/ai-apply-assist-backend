import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { uploadCV, removeCV } from '../controllers/cvController.js';
import multer from "multer";

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ["application/pdf"];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Only PDF files are allowed"), false);
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});


const router = express.Router();

router.post("/upload", authMiddleware, upload.single('cv'),  uploadCV);
router.delete("/removeCV", authMiddleware, removeCV);

export default router;