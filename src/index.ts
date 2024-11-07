import express, { Application } from 'express';
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./routes/docs-route";
import cors from 'cors';
import corsOptions from './config/corsConfig';
import dotenv from 'dotenv';
import connectDB from './config/db';
import bodyParser from 'body-parser';
import userRoutes from './routes/user-routes';
import categoryRoutes from './routes/category-routes';
import {ErrorMiddleware} from "./middlewares/error-middleware";
import session from "express-session";
import {getEnv} from "./utils/getenv";
import {complaintRoutes} from "./routes/complaint-routes";
dotenv.config();

export const app: Application = express();
const port = 3000;

app.use(session({
  secret: getEnv('SESSION_SECRET'),
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // set true if using HTTPS
    httpOnly: true
  }}));
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// database connecting
connectDB();

// routes
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/complaints', complaintRoutes);

// errors handling middleware
app.use(ErrorMiddleware);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});