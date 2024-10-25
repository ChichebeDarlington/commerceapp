import express from "express";
import {
  addToCart,
  getCartProducts,
  removeAllCart,
  updateCartQuantity,
} from "../controllers/cartController.js";
import { protectedRoute } from "../middlewares/protectedRoute.js";

const router = express.Router();

router.get("/get-cart-products", protectedRoute, getCartProducts);
router.post("/add-to-cart", protectedRoute, addToCart);
router.delete("/remove-from-cart", protectedRoute, removeAllCart);
router.put("/update-cart-quantity/:id", protectedRoute, updateCartQuantity);

export default router;
