import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../redux/user/userSlice.js";

export default function SignIn() {
  // state form data, state awal diatur object kosong
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error: errorMessage } = useSelector((state) => state.user);

  // function handle change, dipanggil setiap kali ada perubahan pada inputan form data
  const handleChange = (e) => {
    // memperbarui state formData.
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    // e.target.id, adalah id dari elemen inputan yang berubah (username, email, password).
    // e.target.value.trim(), adalah nilai baru dari inputan tersebut, dan trim() untuk menghapus spasi depan dan belakang
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validasi jika data tidak dimasukkan
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill out all fields!"));
    }

    // start
    try {
      dispatch(signInStart());

      // response data
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      // mengonversi response dari server yang berupa JSON menjadi object js
      const data = await res.json();

      // validasi, jika ada data(username, email) yang sama, maka tampilkan pesan error
      if (data.success === false) {
        dispatch(signInFailure(data.message));
      }

      // validasi, jika proses validasi SignIn berhasil, maka pengguna di navigate ke sign-in
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <>
      <div className="min-h-screen mt-20">
        <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
          {/* left */}
          <div className="flex-1">
            <Link to={"/"} className="text-4xl font-bold dark:text-white">
              <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                Rizki's
              </span>
              Blog
            </Link>
            <p className="text-sm mt-5">
              This is a demo project. You can sign in with your email and
              password or with Google.
            </p>
          </div>
          {/* right form input */}
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <Label value="Your Email" />
                <TextInput
                  type="email"
                  placeholder="name@company.com"
                  id="email"
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label value="Your Password" />
                <TextInput
                  type="password"
                  placeholder="***********"
                  id="password"
                  onChange={handleChange}
                />
              </div>
              <Button
                type="submit"
                gradientDuo
                Tone="purpleToPink"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    <span>Loading...</span>
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
            <div className="flex gap-2 text-sm mt-5">
              <span>Dont Have an account?</span>
              <Link to="/sign-up" className="text-blue-500">
                Sign Up
              </Link>
            </div>
            {errorMessage && (
              <Alert className="mt-5" color="failure">
                {errorMessage}
              </Alert>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
