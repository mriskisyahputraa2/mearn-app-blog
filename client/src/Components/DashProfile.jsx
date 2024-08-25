import { Alert, Button, Modal, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage"; // mengimpor fungsi-fungsi Firebase Storage untuk mengelola penyimpanan file dan mengunggahnya
import { app } from "../firebase"; // Mengimpor konfigurasi aplikasi Firebase
import { CircularProgressbar } from "react-circular-progressbar"; // Komponen progress bar berbentuk lingkaran.
import "react-circular-progressbar/dist/styles.css"; // mengimpor style untuk CircularProgressbar.
import {
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} from "../redux/user/userSlice.js"; // mengimpor action Redux untuk mengelola status pembaruan pengguna.
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user); // mengambil data pengguna saat ini dari Redux Store
  const [imageFile, setImageFile] = useState(null); // menyimpan gambar yang dipilih pengguna
  const [imageFileUrl, setImageFileUrl] = useState(null); // menyimpan url gambar yang dipilih pengguna
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null); // menyimpan progress upload gambar
  const [imageFileUploadError, setImageFileUploadError] = useState(null); // menyimpan pesan kesalahan upload gambar
  const [imageFileUploading, setImageFileUploading] = useState(false); // menyimpan status apakah gambar sedang diunggah
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null); // menyimpan pesan sukses pembaruan pengguna
  const [updateUserError, setUpdateUserError] = useState(null); // menyimpan pesan kesalahan pembaruan pengguna
  const [showModal, setShowModal] = useState(false);
  const [fromData, setFormData] = useState({}); // // menyimpan data formulir pengguna
  const filePickerRef = useRef(); // Referensi DOM untuk input file
  const dispatch = useDispatch(); // Dispatch action Redux untuk mengubah state

  // function handleImageChange
  const handleImageChange = (e) => {
    const file = e.target.files[0]; // mengambil file pertama yang dipilih pengguna.

    // validasi, apakah file img ada?
    if (file) {
      setImageFile(file); // Mengatur state dengan file gambar yang dipilih.
      setImageFileUrl(URL.createObjectURL(file)); // membuat url img lokal sementera untuk ditampilkan dihalaman web
    }
  };

  // menjalankan efek samping setiap kali 'imageFile' berubah
  useEffect(() => {
    // validasi, jika imageFile berubah(pengguna memilih gambar baru), maka
    if (imageFile) {
      uploadImage(); // img di upload, dengan gambar yang baru
    }
  }, [imageFile]);

  // function uploadImage, proses upload image
  const uploadImage = () => {
    // menetapkan status upload menjadi 'true' dan menghapus pesan kesalahan yang ada 'null'
    setImageFileUploading(true);
    setImageFileUploadError(null);

    const storage = getStorage(app); // mendapatkan referensi ke Firebase Storage
    const fileName = new Date().getTime() + imageFile.name; // membuat nama file yang unik
    const storageRef = ref(storage, fileName); // membuat referensi penyimpanan di Firebase Storage
    const uploadTask = uploadBytesResumable(storageRef, imageFile); // mengunggah file ke firebase storage

    // melakukan perubahan status dari proses upload image, ada tiga callback:
    uploadTask.on(
      "state_changed",

      // callback progress upload image
      (snapshot) => {
        // Menghitung persentase progres
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0)); // mengatur state progres upload
      },

      // callback jika ada kesalahan
      (error) => {
        // pesan jika pengguna memasukkan img lebih besar dari 2MB
        setImageFileUploadError(
          "Tidak dapat mengunggah gambar (File harus kurang dari 2MB)"
        );

        // menetapkan progres upload menjadi 'null', dan mereset state terkait gambar
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },

      // callback sukses upload image
      () => {
        // Mendapatkan URL download untuk file yang baru saja diunggah dari Firebase Storage, dan kemudian menyimpannya dalam state imageFileUrl
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL); // menyimpan URL gambar yang diunggah
          setFormData({ ...fromData, profilePicture: downloadURL }); // memperbarui state form dengan URL gambar
          setImageFileUploading(false);
        });
      }
    );
  };

  // function handleChange, untuk menangani perubahan input dari form
  const handleChange = (e) => {
    setFormData({ ...fromData, [e.target.id]: e.target.value });
  };

  // function handleSubmit, untuk menangani pengiriman form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // menetapkan state untuk mereset pesan kesalahan atau sukses sebelumnya
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    // validasi, apakah ada perubahan dari form data, jika tidak
    if (Object.keys(fromData).length === 0) {
      setUpdateUserError("Tidak ada perubahan yang dilakukan");
      return;
    }

    // validasi, apakah pengunggahan gambar sedang berlangsung
    if (imageFileUploading) {
      setUpdateUserError("Mohon tunggu hingga file gambar diunggah");
      return;
    }

    try {
      // memulai update
      dispatch(updateStart());

      // mengirim API PUT ke server, untuk memperbaruhi profile pengguna berdasarkan id dengan data 'formData'
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fromData),
      });

      const data = await res.json();

      // validasi, apakah prosesnya berhasil? jika tidak
      if (!res.ok) {
        dispatch(updateFailure(data.message)); // panggil updateFailure dengan pesan kesalahan
        setUpdateUserError(data.message);

        // jika berhasil
      } else {
        dispatch(updateSuccess(data)); // updateSuccess dipanggil
        setUpdateUserSuccess("Profil pengguna berhasil diperbarui");
      }

      // jika ada kesalahan selama pengiriman data, tampilkan pesan kesalahan
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };

  // function ndelete user
  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  // function signout/keluar
  const handleSignout = async () => {
    try {
      // mendapatkan API signout
      const res = await fetch(`/api/user/signout`, {
        method: "POST",
      });

      // mengambil data response dalam format JSON
      const data = res.json();

      // validasi, apakah data response tidak OK
      if (!res.ok) {
        console.log(data.message); // jika tidak OK, cetak pesan kesalahan diserver
      } else {
        dispatch(signoutSuccess()); // jika response OK, logout pengguna dari aplikasi
      }
    } catch (error) {
      console.log(error.message); // cetak pesan kesalahan yang terjadi selama proses signout
    }
  };

  return (
    <>
      <div className="max-w-lg mx-auto p-3 w-full">
        <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
            {/* jika img nya ada, dan berhasil diupload */}
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
          {/* end */}

          {/* menampilkan username */}
          <TextInput
            type="text"
            id="username"
            placeholder="Username"
            defaultValue={currentUser.username}
            onChange={handleChange}
          />

          {/* menampilkan email */}
          <TextInput
            type="email"
            id="email"
            placeholder="Email"
            defaultValue={currentUser.email}
            onChange={handleChange}
          />

          {/* menampikan password */}
          <TextInput
            type="password"
            id="password"
            placeholder="Password"
            onChange={handleChange}
          />

          <Button
            type="submit"
            gradientDuoTone="purpleToBlue"
            outline
            disabled={loading || imageFileUploading}
          >
            {loading ? "Loading..." : "Update"}
          </Button>
          {currentUser.isAdmin && (
            <Link to={"/create-post"}>
              <Button
                type="button"
                gradientDuoTone="purpleToPink"
                className="w-full"
                outline
              >
                Create a post
              </Button>
            </Link>
          )}
        </form>
        <div className="text-red-500 flex justify-between mt-5">
          <span className="cursor-pointer" onClick={() => setShowModal(true)}>
            Delete Account
          </span>
          <span className="cursor-pointer" onClick={handleSignout}>
            Sign Out
          </span>
        </div>

        {/* menampilkan pesan alert 'success' jika berhasil di update  */}
        {updateUserSuccess && (
          <Alert color="success" className="mt-5">
            {updateUserSuccess}
          </Alert>
        )}

        {/* menampilkan pesan alert 'error' jika gagal di update  */}
        {updateUserError && (
          <Alert color="failure" className="mt-5">
            {updateUserError}
          </Alert>
        )}
        {error && (
          <Alert color="failure" className="mt-5">
            {error}
          </Alert>
        )}

        <Modal
          show={showModal}
          onClose={() => setShowModal(false)}
          popup
          size="md"
        >
          <Modal.Header />

          <Modal.Body>
            <div className="text-center">
              <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
              <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                Are you sure want to delete your account?
              </h3>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={handleDeleteUser}>
                  Yes, I'm sure
                </Button>
                <Button color="gray" onClick={() => setShowModal(false)}>
                  No, cancel
                </Button>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    </>
  );
}
