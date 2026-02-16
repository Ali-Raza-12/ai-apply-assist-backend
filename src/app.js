import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

const app = express();

app.use(morgan('dev'));
app.use(cors(
    { origin: 'http://localhost:8080', credentials: true }
));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use("/api/user", userRoutes);


export default app;