import express, { Application } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';
dotenv.config(); 

const app: Application = express();
const port = 3000;
connectDB();
app.use(bodyParser.json());

  // Routing
  app.use('/api/auth', authRoutes); //routing for login or register
  
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
