import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";

import { corsOptions } from './config/cors.js';
import { errorHandler } from "./middlewares/errorMiddleware.js"
import { errorResponse } from "./utils/apiResponse.js";

import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import cvRoutes from './routes/cv.routes.js';
import emailRoutes from './routes/email.routes.js';
import jobRoutes from "./routes/job.routes.js"

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200
});

app.use(limiter);

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/auth', authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/cv", cvRoutes);
app.use("/api/v1/email", emailRoutes)
app.use("/api/v1/jobs", jobRoutes)

app.use((req, res) => {
    return errorResponse(res, 404, "Route not found");
})

app.use(errorHandler);

export default app;
