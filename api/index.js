import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";

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

app.use("/api/user/", userRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
