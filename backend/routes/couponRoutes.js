import express from "express";
import {} from "../controllers/cartController.js";
import { protectedRoute } from "../middlewares/protectedRoute.js";
import { getCoupon, validateCoupon } from "../controllers/couponController.js";

const router = express.Router();

router.get("/get-coupon", protectedRoute, getCoupon);
router.post("/validate-coupon", protectedRoute, validateCoupon);

export default router;
