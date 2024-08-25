import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { app } from "../../firebase.js";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function CreatePost() {
  // mendefinisikan state untuk file, progress upload gambar, error upload gambar, dan data form
  const [file, setFile] = useState(null);
  const [ImageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [formData, setFormData] = useState({});

  // upload image ke firebase
  const handleUploadImage = async () => {
    try {
      // validasi, jika image belum dimasukkan
      if (!file) {
        setImageUploadError("Silahkan masukkan gambar");
        return;
      }
      setImageUploadError(null);

      const storage = getStorage(app); // mendapatakn alamat ke penyimpanan firebase
      const fileName = new Date().getTime() + "_" + file.name; // membuat name file unik dengan menambahkan waktu sekarang
      const storageRef = ref(storage, fileName); // membuat alamat penyimpanan untuk file
      const uploadTask = uploadBytesResumable(storageRef, file); // meng-upload file dengan progress

      // mengelola status upload, dengan tiga callback
      uploadTask.on(
        "state_changed", // menghitung dan mengatur progress upload.
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },

        // menangani error upload
        (error) => {
          setImageUploadError(
            "Tidak dapat mengunggah gambar (File harus kurang dari 2MB)"
          );
          setImageUploadProgress(null);
        },

        // complete, mendapatkan URL download dan memperbarui data form
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Gagal mengunggah gambar");
      setImageUploadError(error);
      console.log(error);
    }
  };

  return (
    <>
      <div className="p-3 max-w-3xl mx-auto min-h-screen">
        <h1 className="text-center text-3xl my-7 font-semibold">
          Create a post
        </h1>
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 sm:flex-row justify-between">
            {/* input Title */}
            <TextInput
              type="text"
              placeholder="Title"
              required
              id="title"
              className="flex-1"
            />

            {/* input Category */}
            <Select>
              <option value="uncategorized">Select a category</option>
              <option value="javascript">JavaScript</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
            </Select>
          </div>

          <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
            {/* input file gambar */}
            <FileInput
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />

            {/* tombol upload image */}
            <Button
              type="button"
              gradientDuoTone="purpleToBlue"
              size="sm"
              outline
              onClick={handleUploadImage}
              disabled={ImageUploadProgress}
            >
              {/* style progress upload image  */}
              {ImageUploadProgress ? (
                <div className="w-16 h-16">
                  <CircularProgressbar // lingkaran bar
                    value={ImageUploadProgress}
                    text={`${ImageUploadProgress || 0}`}
                  />
                </div>
              ) : (
                "Upload Image"
              )}
            </Button>
          </div>

          {/* menampilkan pesan error jika ada */}
          {imageUploadError && (
            <Alert color="failure">{imageUploadError}</Alert>
          )}

          {/* menampilkan img yang sudah diupload */}
          {formData.image && (
            <img
              src={formData.image}
              alt="upload"
              className="w-full h-72 object-cover"
            />
          )}
          <ReactQuill
            theme="snow"
            placeholder="Write something..."
            className="h-72 mb-12 "
            required
          />
          <Button type="submit" gradientDuoTone="purpleToPink">
            Publish
          </Button>
        </form>
      </div>
    </>
  );
}
