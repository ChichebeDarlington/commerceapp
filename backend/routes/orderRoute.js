import express from "express";
import {} from "../controllers/cartController.js";
import { protectedRoute } from "../middlewares/protectedRoute.js";
import {
  orderCheckout,
  orderCheckoutSuccess,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/order-checkout", protectedRoute, orderCheckout);
router.post("/order-checkout-success", protectedRoute, orderCheckoutSuccess);

export default router;
