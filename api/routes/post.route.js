import express from "express";
import {
  createPost,
  getPosts,
  deletePost,
} from "../controllers/post.contrroler.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createPost);
router.get("/getposts", getPosts);
router.delete("/deletepost/:postId/:userId", verifyToken, deletePost);

export default router;
