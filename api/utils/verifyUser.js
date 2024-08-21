import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

// middleware token jwt
export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token; // mengakses token yang disimpan didalam cookies dengan nama 'access_token'

  // validasi, jika token tidak ada
  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }

  // mem-verifikasi keaslian token, menerima 3 parameter
  // 'token': token yang diatambil dari cookies
  // "process.env.JWT_SECRET": key jwt
  // (err, user): callback untuk pesan kesalahan dan informasi token yang valid
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    // validasi, jika terdapat error pada saat token nya valid atau tidak
    if (err) {
      return next(errorHandler(401, "Unauthorized"));
    }

    req.user = user; // jika token valid,informasi pengguna disimpan kedalam 'req.user'
    next(); // jika semua proses berhasil, middleware akan melanjutkan ke middleware selanjutnya, 'updateUser'.
  });
};
