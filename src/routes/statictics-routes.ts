import express from 'express';
import { StatisticsController } from '../controllers/statistics-controller';

export const staticticsRoutes = express.Router();

staticticsRoutes.get('/category-percentages', StatisticsController.categoryPercentages);
staticticsRoutes.get('/users', StatisticsController.totalUsers);
staticticsRoutes.get('/complaints', StatisticsController.totalComplaints);
staticticsRoutes.get('/complaints-accepted', StatisticsController.totalComplaintsHasAccepted);
staticticsRoutes.get('/complaints-rejected', StatisticsController.totalComplaintsHasRejected);
staticticsRoutes.get('/complaints-processing', StatisticsController.totalComplaintsInProcessing);