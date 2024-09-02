import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from "bcrypt";

// Functions Update data User
export const updateUser = async (req, res, next) => {
  // mengecek apakah pengguna yang sedang login adalah pemilik akun yang akan diupdate
  if (req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "Anda tidak diizinkan untuk memperbarui pengguna ini")
    ); // Jika bukan, kirim error 403
  }

  // memeriksa apakah password diubah dan melakukan validasi
  if (req.body.password) {
    // validasii panjang password
    if (req.body.password.length < 6) {
      return next(
        errorHandler(400, "Kata sandi minimal harus terdiri dari 6 karakter")
      );
    }

    // hash password sebelum disimpan
    req.body.password = bcrypt.hashSync(req.body.password, 10);
  }

  // memeriksa apakah username diubah dan melakukan validasi
  if (req.body.username) {
    // validasi panjang username
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        errorHandler(
          400,
          "Nama pengguna harus terdiri dari 7 hingga 20 karakter"
        )
      );
    }

    // validasi tidak boleh ada spasi dalam username
    if (req.body.username.includes(" ")) {
      return next(
        errorHandler(400, "Nama pengguna tidak boleh mengandung spasi")
      );
    }

    // validasi username harus huruf kecil
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(
        errorHandler(400, "Nama pengguna harus menggunakan huruf kecil")
      );
    }

    // validasi hanya huruf dan angka
    if (!/^[a-zA-Z0-9]+$/.test(req.body.username)) {
      return next(
        errorHandler(400, "Nama pengguna hanya boleh berisi huruf dan angka")
      );
    }
  }

  try {
    // melakukan update data pengguna di database
    const updateUser = await User.findByIdAndUpdate(
      req.params.userId, // berdasarkan ID pengguna yang akan diupdate
      {
        // menetapkan data baru sesuai yang diinput oleh pengguna
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true } // mengambil data pengguna setalah diupdate
    );

    // menghilangkan password dari respon yang akan dikirim ke pengguna
    const { password, ...rest } = updateUser._doc;
    res.status(200).json(rest); // mengirim response sukses dengan data yang berhasil diupdate
  } catch (error) {
    next(error); // menangani error yang terjadi saat proses pembaruan
  }
};

// Function Delete User
export const deleteUser = async (req, res, next) => {
  // validasi, jika user bukan admin dan user id nya tidak sama dengan parameter userid
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    // maka tampilkan pesan ini
    return next(
      errorHandler(403, "Anda tidak diizinkan untuk menghapus pengguna ini")
    );
  }

  try {
    await User.findByIdAndDelete(req.params.userId); // mencari pengguna berdasarkan userId dari database
    res.status(200).json("Pengguna telah dihapus"); // response jika berhasil
  } catch (error) {
    next(error); // response jika gagal/tidak ada
  }
};

// function signout/keluar aplikasi
export const signout = (req, res, next) => {
  try {
    // jika berhasil
    res.clearCookie("access_token").status(200).json("Pengguna telah keluar"); // menghapus cookie bernama "access_token"
  } catch (error) {
    next(error);
  }
};

// Function GetUsers
export const getUsers = async (req, res, next) => {
  // validasi, jika user nya bukan admin
  if (!req.user.isAdmin) {
    // tampilkan pesan
    return next(
      errorHandler(403, "Anda tidak diizinkan untuk melihat semua pengguna")
    );
  }

  try {
    const startIndex = parseInt(req.query.startIndex) || 0; // mengambil nilai startIndex dari query parameter, jika tidak ada, akan diset ke-0
    const limit = parseInt(req.query.limit) || 9; // limit untuk membatasi jumlah pengguna yang ditampilkan
    const sortDirection = req.query.order === "asc" ? 1 : -1; // menentukan arah pengurutan, 1 untuk ascending dan -1 untuk descending

    // mencari users didatabase mengurutkan berdasarkan
    const users = await User.find()
      .sort({ createdAt: sortDirection }) // tanggal pembuatan
      .skip(startIndex) // melewati sejumlah pengguna
      .limit(limit); // membatasi users yang ditampilkan

    // menghilangkan field password dari response success pengguna untuk keamanan
    const userWithoutPassword = users.map((user) => {
      const { password, ...rest } = user._doc;
      return rest;
    });

    // menghitung jumlah total pengguna didalam database
    const totalUsers = await User.countDocuments();

    const now = new Date(); // mendapatakn waktu sekarang

    // menghitung jumlah pengguna yang dibuat dalam satu bulan terakhir
    const oneMonthAgo = new Date(
      now.getFullYear(), // tahun
      now.getMonth() - 1, // bulan dikurang -1
      now.getDate() // tanggal
    );

    // menghitung jumlah users yang diubat dalam satu bulan terakhir
    const lastMonthUsers = await User.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    // response success
    res.status(200).json({
      users: userWithoutPassword,
      totalUsers,
      lastMonthUsers,
    });
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return next(errorHandler(404, "Pengguna tidak ditemukan!"));
    }

    const { password, ...rest } = user._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};
