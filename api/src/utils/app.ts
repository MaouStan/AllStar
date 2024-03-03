import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import { uploadRouter } from '../api/upload';
import { jwtAuthen } from '../middleware/auth_middleware';
import { imageRouter } from '../api/image';
import { voteRouter } from '../api/vote';
import { authRouter } from '../api/auth';
import { userRouter } from '../api/user';

// App Variables
dotenv.config();

export const app: Application = express();

// using the dependencies
app.use(bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  bodyParser.raw()
); // body accepts JSON, form-data
app.use(helmet()); // security
app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // allow the frontend to access this server
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

// JWT middleware
app.use(jwtAuthen);

// API
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

// Routes
app.use('/api/upload', uploadRouter);
app.use('/api/image', imageRouter);
app.use('/api/vote', voteRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);