import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// Function SignUp
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required!")); // use function errorHandler from utils
  }

  try {
    // Check if the username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return next(
        errorHandler(
          400,
          "Username and email already in use, please try again!"
        )
      );
    }

    const hashPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashPassword,
    });

    await newUser.save();
    res.json({ user: [newUser], message: "Signup successfull" });
  } catch (error) {
    next(error);
  }
};

// Function SignIn
export const signin = async (req, res, next) => {
  const { email, password } = req.body; // mendapatkan request email dan password dari pengguna

  // validasi, email dan password tidak boleh kosong
  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required!"));
  }

  try {
    const validUser = await User.findOne({ email }); // mencari user melalui email-nya

    // validasi, jika email tidak ditemukan
    if (!validUser) {
      return next(errorHandler(400, "User not found!"));
    }

    // validasi, jika pengguna ditemukan dan mecocokkan dengan password yang sudah di daftarkan
    const validPassword = bcrypt.compareSync(password, validUser.password);

    // validasi, password jika salah dan tidak sesuai dengan proses signIn
    if (!validPassword) {
      return next(errorHandler(400, "Invalid Password!"));
    }

    // membuat token jwt
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET
    );

    // tidak menampilkan password saat login berhasil(untuk keamanan)
    const { password: pass, ...rest } = validUser._doc;

    // manampilkan data user ketika berhasil login
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Function SignIn dan SignUp With Google Account
export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body; // mendapatkan req email, name dan google photo dari pengguna

  // start
  try {
    const user = await User.findOne({ email }); // mencari user berdasarkan email

    // validasi, jika user ada
    if (user) {
      // membuat token
      const token = jwt.sign(
        { id: user.id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc; // dihilangkan dari objek pengguna yang akan dikirimkan ke klien

      // jika berhasil tampilkan data nya
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);

      // jika pengguna tidak ditemukan, sistem akan membuat pengguna baru
    } else {
      // Sistem menghasilkan kata sandi acak dengan menggabungkan dua string acak yang dihasilkan oleh Math.random().toString(36).slice(-8).
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      // Kata sandi tersebut kemudian di-hash menggunakan bcrypt.hashSync dengan tingkat keamanan (saltRounds) 10.
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

      // Sebuah objek pengguna baru (newUser) dibuat dengan username yang dihasilkan dari nama pengguna yang diubah menjadi huruf kecil, tanpa spasi, dan ditambah dengan angka acak.
      // Email dan foto profil pengguna Google juga ditambahkan ke objek pengguna baru ini
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });

      // setelah data berhasil, baru disimpan kedalam database mongodb
      await newUser.save();
      // Token JWT dibuat untuk pengguna baru dengan cara yang sama seperti pada pengguna yang sudah ada.
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );
      const { password, ...rest } = user._doc;

      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
