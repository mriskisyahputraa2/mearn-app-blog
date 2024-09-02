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

// function like comment (updated)
export const likeComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(errorHandler(404, "Komentar tidak ditemukan"));
    }

    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }

    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

// function edit comment
export const editComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return next(errorHandler(404, "Komentar tidak ditemukan"));
    }

    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      return next(
        errorHandler(403, "Anda tidak diizinkan untuk mengedit komentar ini")
      );
    }

    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      {
        new: true,
      }
    );

    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
};
