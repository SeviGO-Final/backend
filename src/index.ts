import express, { Application } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import bodyParser from 'body-parser';
import publicRoutes from './routes/auth_route';
import {ErrorMiddleware} from "./middlewares/error-middleware";
dotenv.config(); 

const app: Application = express();
const port = 3000;

// database connecting
connectDB();

app.use(bodyParser.json());

// routing for login or register
app.use('/api', publicRoutes);

// errors handling middleware
app.use(ErrorMiddleware);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});