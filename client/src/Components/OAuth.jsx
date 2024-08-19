import { Button } from "flowbite-react";
import { AiFillGoogleCircle } from "react-icons/ai";
import { app } from "../firebase.js";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth"; // untuk autentikasi dengan Google.
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInSuccess } from "../redux/user/userSlice.js";

export default function OAuth() {
  // Inisialisasi Firebase Auth, Dispatch, dan Navigate
  const auth = getAuth(app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fungsi ini dipanggil saat pengguna mengklik tombol "Continue with Google".
  const handleGoogleClick = async () => {
    // Membuat instance dari GoogleAuthProvider yang digunakan untuk menyediakan autentikasi dengan Google.
    const provider = new GoogleAuthProvider();

    // Mengatur parameter khusus, seperti prompt: "select_account", yang memaksa pengguna untuk memilih akun setiap kali login.
    provider.setCustomParameters({ prompt: "select_account" });

    // Autentikasi dengan Google dan Pengiriman Data ke Server
    try {
      //  Membuka jendela popup untuk login dengan Google, menggunakan autentikasi Firebase.
      const resutlFormGoogle = await signInWithPopup(auth, provider);

      // Mengirimkan permintaan POST ke endpoint /api/auth/google.
      // dengan mengirimkan data pengguna seperti name, email, dan googlePhotoUrl yang diperoleh dari respons Google.
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resutlFormGoogle.user.displayName,
          email: resutlFormGoogle.user.email,
          googlePhotoUrl: resutlFormGoogle.user.photoURL,
        }),
      });

      const data = await res.json(); //  Hasil JSON dari respons server

      // validasi, jika berhasil. Mengirim aksi signInSuccess ke Redux store untuk memperbarui state dengan data pengguna.
      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Button
        type="button"
        gradientDuoTone="pinkToOrange"
        outline
        onClick={handleGoogleClick}
      >
        <AiFillGoogleCircle className="w-6 h-6 mr-2" />
        Continue with Google
      </Button>
    </>
  );
}
