import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import { errorHandler } from "../utils/error.js";

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
    next(errorHandler(400, "All fields are required")); // use function errorHandler from utils
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
