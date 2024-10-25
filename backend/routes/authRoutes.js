import express from "express";
import {
  login,
  logout,
  signup,
  refreshToken,
  userProfile,
  //   userProfile
} from "../controllers/authController.js";
import { protectedRoute } from "../middlewares/protectedRoute.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.get("/user-profile", protectedRoute, userProfile);

export default router;
