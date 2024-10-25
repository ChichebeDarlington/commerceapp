import express from "express";
import {} from "../controllers/cartController.js";
import { adminRoute, protectedRoute } from "../middlewares/protectedRoute.js";
import { dataAnalytics } from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/analytics", protectedRoute, adminRoute, dataAnalytics);

export default router;
