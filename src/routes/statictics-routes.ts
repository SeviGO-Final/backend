import express from "express";
import { StatisticsController } from "../controllers/statistics-controller";

export const staticticsRoutes = express.Router();

staticticsRoutes.get(
  "/category-percentages",
  StatisticsController.categoryPercentages
);
staticticsRoutes.get("/users", StatisticsController.totalUsers);
staticticsRoutes.get("/feedbacks", StatisticsController.totalFeedback);
staticticsRoutes.get("/complaints", StatisticsController.totalComplaints);
staticticsRoutes.get(
  "/complaints-Finished",
  StatisticsController.totalComplaintsHasFinished
);
staticticsRoutes.get(
  "/complaints-Rejected",
  StatisticsController.totalComplaintsHasRejected
);
staticticsRoutes.get(
  "/complaints-Processing",
  StatisticsController.totalComplaintsInProcessing
);
