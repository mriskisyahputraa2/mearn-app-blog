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
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

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
