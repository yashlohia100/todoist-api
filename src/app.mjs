import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import todoRouter from './entities/todo/todoRoutes.mjs';
import userRouter from './entities/user/userRoutes.mjs';
import AppError from './utils/appError.mjs';
import globalErrorHandler from './entities/error/errorController.mjs';
import authRouter from './entities/auth/authRoutes.mjs';
import config from '../config.mjs';

const app = express();

/***************************************
 * Middlewares
 **************************************/

app.use(morgan('dev'));
app.use(express.json());
// app.use(cors());
app.use(cors({ origin: config.FRONTEND_URL, credentials: true }));
// app.use(cors({ origin: 'http://192.168.0.108:5173', credentials: true }));
app.use(cookieParser());

/***************************************
 * Routes
 **************************************/

app.get('/test', (req, res) => {
  res.status(200).json({ status: 'success' });
});

app.use('/api/todos', todoRouter);
app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

/***************************************
 * Error handling
 **************************************/

app.all('*', (req, res, next) => {
  return next(
    new AppError(`Can't find ${req.originalUrl} on this server!`, 404)
  );
});

// Global error handling middleware
app.use(globalErrorHandler);

export default app;
