import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

dotenv.config();
// connent database mongodb
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("MongoDb is connect");
  })
  .catch((err) => {
    console.log("error", err);
  });

const app = express();

// middleware for resutls json and cookie parser
app.use(express.json());
app.use(cookieParser());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

// middleware routes
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

// middleware for message error
app.use((err, req, res, next) => {
  // initial status code error(500)
  const statusCode = err.statusCode || 500;
  // initial error message
  const message = err.message || "Internal Server Error";
  // response status and message
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
