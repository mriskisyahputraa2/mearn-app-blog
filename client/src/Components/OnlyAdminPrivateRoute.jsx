import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom"; //outlet digunakan sebagai tempat dimana komponent chid dari route dirender

export default function OnlyAdminPrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);

  return currentUser && currentUser.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" />
  );
}
