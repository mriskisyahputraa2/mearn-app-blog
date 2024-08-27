import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

export const createPost = async (req, res, next) => {
  console.log(req.user);

  // validasi, apakah pengguna adalah "admin"
  if (!req.user.isAdmin) {
    return next(
      errorHandler("Anda tidak diizinkan untuk membuat post, Anda bukan admin")
    );
  }

  // validasi, apakah title dan content sudah dimasukkan atau belum
  if (!req.body.title || !req.body.content) {
    return next(errorHandler("Harap isi semua kolom yang diperlukan"));
  }

  // membuat slug dari title(judul)
  const slug = req.body.title
    .split(" ") // memisahkan string "title" menjadi array ex:['Post', "Baru"]
    .join("_") // menggabungkan kembali array menjadi satu string, dengan garis bawah ex: ["Post_baru"]
    .toLowerCase() // mengubah semua huruf menjadi kecil
    .replace(/[^a-zA-Z0-9-]/g, "-"); // Mengganti semua karakter yang bukan huruf (a-z, A-Z), angka (0-9), atau tanda hubung (-) dengan tanda hubung (-). memastikan bahwa slug hanya berisi karakter yang diizinkan.

  // membuat post baru
  const newPost = new Post({
    ...req.body, // dengan data yang diambil dari body
    slug, // menambahkan properti "slug" yang baru saja dibuat dari "title"
    userId: req.user.id, // menambahkan properti "userId" yang diambil dari ID pengguna
  });

  try {
    // jika proses berhasil, simpan data post kedatabase
    const savePost = await newPost.save();
    res.status(201).json(savePost); // response berhasil
  } catch (error) {
    next(error); // response gagal
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),

      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updateAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = new Date();

    const oneMothAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMontPosts = await Post.countDocuments({
      createAt: { $gte: oneMothAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMontPosts,
    });
  } catch (error) {
    next(error);
  }
};
