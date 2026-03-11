import express from "express";
import { jobApplications } from "../controllers/job.controller.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"

const router = express.Router();

router.get("/", authMiddleware, jobApplications)

export default router;