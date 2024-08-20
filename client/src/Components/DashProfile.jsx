import { Alert, Button, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage"; // Fungsi-fungsi dari Firebase untuk mengelola penyimpanan file (gambar) dan mengunggahnya ke Firebase Storage.
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar"; // Komponen untuk menampilkan progress bar berbentuk lingkaran, menunjukkan status pengunggahan file.
import "react-circular-progressbar/dist/styles.css";

export default function DashProfile() {
  const { currentUser } = useSelector((state) => state.user); // mengambil informasi data pengguna
  const [imageFile, setImageFile] = useState(null); // menyimpan gambar yang dipilih pengguna
  const [imageFileUrl, setImageFileUrl] = useState(null); // menyimpan url gambar yang dipilih pengguna
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null); // menyimpan upload progress img yang dipilih pengguna
  const [imageFileUploadError, setImageFileUploadError] = useState(null); // menyimpan pesan kesalahan img

  const filePickerRef = useRef(); // Referensi DOM untuk elemen input file, memungkinkan kita untuk memicu pemilihan file secara manual.

  // function handle Image Change dipanggil ketika pengguna memilih gambar
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // mengambil file img pertama yang diinputkan oleh pengguna

    // validasi, apakah file img ada? jika ya
    if (file) {
      setImageFile(file); // maka state imageFile dengan img yang diinputkan, diunggah ke firebase storage
      setImageFileUrl(URL.createObjectURL(file)); // membuat url img lokal sementera untuk ditampilkan dihalaman web, url ini akan hilang ketika browser ditutup
    }
  };

  // render
  useEffect(() => {
    // validasi, jika imageFile berubah(pengguna memilih gambar baru), maka
    if (imageFile) {
      uploadImage(); // img di upload dengan gambar yang baru
    }
  }, [imageFile]);

  // function uploadImage
  const uploadImage = () => {
    // service firebase.storage {
    //     match /b/{bucket}/o {
    //       match /{allPaths=**} {
    //         allow read, write: if
    //         request.resource.size < 2 * 1024 * 1024 &&
    //         request.resource.contentType.matches('image/.*')
    //       }
    //     }
    //   }

    setImageFileUploadError(null); // memastikan tidak ada pesan kesalahan yang ditampilkan

    const storage = getStorage(app); // "Mendapatkan" referensi ke Firebase Storage dari aplikasi Firebase yang telah diinisialisasi (app).

    const fileName = new Date().getTime() + imageFile.name; // membuat nama file yang unik dengan menggabungkan waktu saa ini, dengan nama asli file (imageFile.name).

    const storageRef = ref(storage, fileName); // "Membuat" referensi ke lokasi di Firebase Storage di mana file akan disimpan, menggunakan nama file yang sudah dibuat tadi.

    const uploadTask = uploadBytesResumable(storageRef, imageFile); // meng-upload file ke firebase storage secara bertahap

    // melakukan perubahan status dari proses upload image
    uploadTask.on(
      "state_changed",

      // (callback) yang dieksekusi saat ada perubahan status dari proses upload image
      (snapshot) => {
        // Menghitung persentase progres pengunggahan berdasarkan jumlah byte yang telah diunggah (snapshot.bytesTransferred) dan total ukuran file (snapshot.totalBytes).
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        // Mengatur state imageFileUploadProgress dengan nilai progres yang sudah dihitung tadi. toFixed(0) digunakan untuk membulatkan nilai ke angka bulat.
        setImageFileUploadProgress(progress.toFixed(0));
      },

      // (Callback) yang dijalankan jika terjadi kesalahan selama upload img
      (error) => {
        // pesan jika pengguna memasukkan img lebih besar dari 2MB
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );

        // Mengatur progres pengunggahan menjadi null karena pengunggahan gagal.
        setImageFileUploadProgress(null);

        // kedua state ini, berfungsi untuk mengosongkan img seperti semula jika terjadi kesalahan upload image
        setImageFile(null);
        setImageFileUrl(null);
      },

      // (Callback) yang dijalankan ketika pengunggahan selesai dengan sukses
      () => {
        // Mendapatkan URL download untuk file yang baru saja diunggah dari Firebase Storage, dan kemudian menyimpannya dalam state imageFileUrl
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL); // menampilkan gambar yang telah diunggah di halaman.
        });
      }
    );
  };

  return (
    <>
      <div className="max-w-lg mx-auto p-3 w-full">
        <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
        <form className="flex flex-col gap-4">
          {/* upload new img */}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            ref={filePickerRef}
            hidden
          />

          {/* start menampilkan gambar profile  */}
          <div
            className="relative w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
            onClick={() => filePickerRef.current.click()} // tombol click agar pengguna bisa ganti gambar dan menampilkannya
          >
            {/* jika img nya ada dan berhasil diupload */}
            {imageFileUploadProgress && (
              // menampilkan styling lingkaran bar pada saat proses upload img
              <CircularProgressbar
                value={imageFileUploadProgress || 0} // Menunjukkan seberapa banyak progres yang sudah tercapai (dalam persen).
                text={`${imageFileUploadProgress}%`} // Menampilkan teks yang menunjukkan persentase progres.
                strokeWidth={5} // Menentukan ketebalan garis lingkaran.
                styles={{
                  // Mengatur ukuran dan posisi indikator supaya menutupi seluruh container.
                  root: {
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: "0",
                    left: "0",
                  },

                  // mengatur warna garis
                  path: {
                    stroke: `rgba(62, 152, 199, ${
                      imageFileUploadProgress / 100
                    })`,
                  },
                }}
              />
            )}

            {/* Start Gambar Profil */}
            <img
              src={imageFileUrl || currentUser.profilePicture} // menampilkan gambar baru yang diupload
              alt="user"
              className={`rounded-full w-full h-full object-cover border-8 border-[lightgray]${
                imageFileUploadProgress &&
                imageFileUploadProgress < 100 &&
                "opacity-60"
              }`}
            />
            {/* End Gambar Profil */}
          </div>
          {/* end menampilkan gambar profile  */}

          {/* menampilkan pesan alert kesalahan, jika img nya lebih dari 2MB */}
          {imageFileUploadError && (
            <Alert color="failure">{imageFileUploadError}</Alert>
          )}

          {/* menampilkan username */}
          <TextInput
            type="text"
            id="username"
            placeholder="Username"
            defaultValue={currentUser.username}
          />

          {/* menampilkan email */}
          <TextInput
            type="email"
            id="email"
            placeholder="Email"
            defaultValue={currentUser.email}
          />

          {/* menampikan password */}
          <TextInput type="password" id="password" placeholder="Password" />

          <Button type="submit" gradientDuoTone="purpleToBlue" outline>
            Update
          </Button>
        </form>
        <div className="text-red-500 flex justify-between mt-5">
          <span className="cursor-pointer">Delete Account</span>
          <span className="cursor-pointer">Sign Out</span>
        </div>
      </div>
    </>
  );
}
