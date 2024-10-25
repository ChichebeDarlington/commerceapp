import express from "express";
import path from "path";
import dotenv from "dotenv";
import authRoute from "./routes/authRoutes.js";
import productsRoute from "./routes/productsRoutes.js";
import cartRoute from "./routes/cartRoute.js";
import couponRoute from "./routes/couponRoutes.js";
import orderRoute from "./routes/orderRoute.js";
import analyticsRoute from "./routes/analyticsRoute.js";

import { databaseConnect } from "./lib/db.js";
import cookieParser from "cookie-parser";

dotenv.config();

const PORT = process.env.PORT || 7000;

const _dirname = path.resolve;

// modules
const app = express();
app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

// routes
app.use("/api/auth", authRoute);
app.use("/api/products", productsRoute);
app.use("/api/cart", cartRoute);
app.use("/api/coupon", couponRoute);
app.use("/api/order", orderRoute);
app.use("/api/analytics", analyticsRoute);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

const start = () => {
  databaseConnect(process.env.MONGO_URI);
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost ${PORT}`);
  });
};

start();
