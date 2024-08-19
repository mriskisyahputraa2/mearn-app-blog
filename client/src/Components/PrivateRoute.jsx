import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom"; //outlet digunakan sebagai tempat dimana komponent chid dari route dirender

// agar pengguna tidak bisa masuk kehalaman dashboard, harus melalui login dulu
export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);

  // jika currentUser(artinya sudah login), maka komponent outlet akan dirender
  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
  // jika currentUser(belum login), maka pengguna diarahkan kehalaman sign-in
}
