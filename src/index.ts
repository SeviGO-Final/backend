import express, { Application } from 'express';
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./routes/docs-route";
import cors from 'cors';
import corsOptions from './config/corsConfig';
import dotenv from 'dotenv';
import connectDB from './config/db';
import bodyParser from 'body-parser';
import publicRoutes from './routes/public-route';
import {ErrorMiddleware} from "./middlewares/error-middleware";
dotenv.config(); 

export const app: Application = express();
const port = 3000;

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(bodyParser.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// database connecting
connectDB();

// routing for login or register
app.use('/api', publicRoutes);

// errors handling middleware
app.use(ErrorMiddleware);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});