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
    // mencari data comment berdasarkan parameter commentId
    const comment = await Comment.findById(req.params.commentId);

    // jika comment tidak ditemukan
    if (!comment) {
      return next(errorHandler(404, "Komentar tidak ditemukan"));
    }

    // mencari index dari ID pengguna yang melakukan request dalam array 'likes' pada object comment. jika ID tidak ditemukan, indexOf mengembalikan -1.
    const userIndex = comment.likes.indexOf(req.user.id);

    // validasi, apakah pengguna sudah menyukai komentar
    if (userIndex === -1) {
      // jika belum, maka tambahkan 1 like ke jumlah 'numberOfLikes'
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      // jika ID pengguna sudah menyukai komentar, maka dikurangin 1 dari 'numberOfLikes'
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }

    // simpan data like
    await comment.save();

    // response berhasil
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

// function edit comment
export const editComment = async (req, res, next) => {
  try {
    // mencari komentar berdasarkan ID yang dibeikan
    const comment = await Comment.findById(req.params.commentId);

    // jika komentar tidak ditemukan
    if (!comment) {
      return next(errorHandler(404, "Komentar tidak ditemukan"));
    }

    // validasi, jika userId comment tidak sama dengan request user id dan user juga bukan admin
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      // maka, tampilkan pesan ini
      return next(
        errorHandler(403, "Anda tidak diizinkan untuk mengedit komentar ini")
      );
    }

    // jika proses validasi berhasil, maka update content komentar
    const editedComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      {
        new: true, // untuk mengembalikan komentar yang sudah diperbarui.
      }
    );

    // response berhasil
    res.status(200).json(editedComment);
  } catch (error) {
    next(error);
  }
};

// function delete comment
export const deleteComment = async (req, res, next) => {
  try {
    // mencari komentar berdasarkan ID yang dibeikan
    const comment = await Comment.findById(req.params.commentId);

    // jika komentar tidak ditemukan
    if (!comment) {
      return next(errorHandler(404, "Komentar tidak ditemukan"));
    }

    // validasi, jika userId comment tidak sama dengan request user id dan user juga bukan admin
    if (comment.userId !== req.user.id && !req.user.isAdmin) {
      // maka, tampilkan pesan ini
      return next(
        errorHandler(403, "Anda tidak diizinkan untuk menghapus komentar ini")
      );
    }

    // menhapus komentar dari database
    await Comment.findByIdAndDelete(req.params.commentId);

    // response berhasil
    res.status(200).json("Komentar telah dihapus");
  } catch (error) {
    next(error);
  }
};
