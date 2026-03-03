import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cvRoutes from './routes/cvRoutes.js';
// import generateEmailRoutes from './routes/'
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

const app = express();

app.use(morgan('dev'));
const allowedOrigins = [
    'http://localhost:8080',
    'http://localhost:8082',
    'https://id-preview--e2596c08-fd4c-4e6c-8976-e2a5bbb16a7b.lovable.app'
];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('CORS policy: origin not allowed'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/cv", cvRoutes);
// app.user("/api/ai", generateEmailRoutes)


export default app;