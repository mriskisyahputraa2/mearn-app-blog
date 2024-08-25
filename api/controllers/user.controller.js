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
  // validasi, apakah ID pengguna yang sedang login berbeda dari ID pengguna yang dihapus?
  if (req.user.id !== req.params.userId) {
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
