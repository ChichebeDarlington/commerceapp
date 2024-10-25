import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  recommendedProducts,
  toggleFeaturedProduct,
} from "../controllers/productsController.js";
import { adminRoute, protectedRoute } from "../middlewares/protectedRoute.js";

const router = express.Router();

router.get("/get-all-product", protectedRoute, adminRoute, getAllProducts);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/recommended", recommendedProducts);
router.post("/create", protectedRoute, adminRoute, createProduct);
router.delete("/delete/:id", protectedRoute, adminRoute, deleteProduct);
router.patch("/toggle/:id", protectedRoute, adminRoute, toggleFeaturedProduct);

// router.get("/user-profile", userProfile);

export default router;
