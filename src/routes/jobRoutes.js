import express from "express";
import { jobApplications } from "../controllers/jobController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js"

const router = express.Router();

router.get("/myjobs", authMiddleware, jobApplications)

export default router;