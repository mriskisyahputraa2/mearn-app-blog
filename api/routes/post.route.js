import express from "express";
import { createPost, getPosts } from "../controllers/post.contrroler.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createPost);
router.get("/getpost", getPosts);

export default router;
