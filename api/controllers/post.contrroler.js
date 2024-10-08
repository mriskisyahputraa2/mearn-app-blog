import Post from "../models/post.model.js";
import { errorHandler } from "../utils/error.js";

// function membuat posts
export const createPost = async (req, res, next) => {
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

// function mendatapakan semua data posts
export const getPosts = async (req, res, next) => {
  try {
    // inisialisasi searching posts
    const startIndex = parseInt(req.query.startIndex) || 0; // mengambil nilai dari query string, jika tidak ada, default ke 0
    const limit = parseInt(req.query.limit) || 9; // mengambil nilai limit dari query string, jika tidak ada, default ke 9
    const sortDirection = req.query.order === "asc" ? 1 : -1; // menentukan arah pengurutan, 1 untuk ascending dan -1 untuk descending

    // mencari(search) postingan di database
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }), // jika ada "userId" di query string, tambahkan ke kondisi pencarian
      ...(req.query.category && { category: req.query.category }), // jika ada "category" di query string, tambahkan ke kondisi pencarian
      ...(req.query.slug && { slug: req.query.slug }), // Jika ada "slug" di query string, tambahkan ke kondisi pencarian
      ...(req.query.postId && { _id: req.query.postId }), // Jika ada "postId" di query string, tambahkan ke kondisi pencarian

      // Jika ada "searchTerm" di query string, cari di "title" atau "content" yang mengandung kata tersebut [i].
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })

      .sort({ updateAt: sortDirection }) // Mengurutkan hasil pencarian berdasarkan "updateAt" dengan arah yang ditentukan.
      .skip(startIndex) // Melewati sejumlah postingan berdasarkan "startIndex".
      .limit(limit); // Membatasi jumlah postingan yang ditampilkan ke halaman, diambil berdasarkan "limit".

    // inisialisasi, menghitung Postingan dalam Sebulan Terakhir
    const totalPosts = await Post.countDocuments(); // menghitung total jumlah postingan di database.
    const now = new Date(); // mendapatkan tanggal dan waktu saat ini.

    // Mendapatkan tanggal satu bulan yang lalu dari sekarang.
    const oneMothAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    // menghitung jumlah postingan yang dibuat dalam sebulan terakhir
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMothAgo },
    });

    // response berhasil
    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });

    // menangani error
  } catch (error) {
    next(error);
  }
};

// function delete posts
export const deletePost = async (req, res, next) => {
  // validasi, jika user nya bukan admin atau user id nya tidak sama dengan parameter userId
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    // tampilkan pesan ini
    return next(
      errorHandler(403, "Anda tidak diizinkan menghapus postingan ini")
    );
  }

  try {
    // mencari dan menghapus postingan berdasarkan parameter postId yang diterima
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json("Postingan telah dihapus"); // pesan success
  } catch (error) {
    next(error); // middleware kesalahan(error)
  }
};

// function update posts
export const updatePost = async (req, res, next) => {
  // validasi, jika user nya bukan admin dan user id nya tidak sama dengan parameter userId
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    // maka tampilkan pesan ini
    return next(
      errorHandler(403, "Anda tidak diizinkan memperbaharui postingan ini")
    );
  }

  try {
    // mencari dan meng-updated post berdasarkan parameter postId
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        // dan berdasarkan request body yang diinput pengguna
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );

    // validasi jika tidak ada ditemukan postingan
    if (!updatedPost) {
      return next(errorHandler(404, "Postingan tidak ditemukan"));
    }

    res.status(200).json(updatedPost); // response success
  } catch (error) {
    next(error);
  }
};
