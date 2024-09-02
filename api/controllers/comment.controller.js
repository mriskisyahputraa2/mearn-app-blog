import Comment from "../models/comment.model.js";
import { errorHandler } from "../utils/error.js";

// Function create comments
export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body; // mendatapatkan inputan dari pengguna

    // validasi, jika userId tidak sama dengan request id user, maka tampilkan pesan
    if (userId !== req.user.id) {
      return next(
        errorHandler(403, "Anda tidak diizinkan untuk membuat komentar ini")
      );
    }

    // jika berhasil, membuat komentar baru
    const newComment = new Comment({
      content,
      postId,
      userId,
    });

    // simpan data komentar ke dalama database
    await newComment.save();

    // response berhasil
    res.status(200).json(newComment);
  } catch (error) {
    next(error); // response error
  }
};

// Funtion mendapatkan semua data comment
export const getPostComment = async (req, res, next) => {
  try {
    // mendapatkan data comment berdasarkan postId yang diurutkan dari terbaru diatas(descending)
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });

    // response berhasil
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};
