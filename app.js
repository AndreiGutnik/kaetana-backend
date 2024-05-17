import cors from 'cors';
import cookieParser from 'cookie-parser'
import 'dotenv/config';
import express from 'express';
import logger from 'morgan';
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger.json" assert { type: "json" };

import authRouter from './routes/api/auth-router.js';
import userRouter from './routes/api/user-router.js'
import productsRouter from './routes/api/products-router.js';

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(express.json());
app.use(cookieParser())
app.use(cors());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/products', productsRouter);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use((err, req, res, next) => {
  const { status = 500, message = 'Server error!' } = err;
  res.status(status).json({ message });
});

export default app;
