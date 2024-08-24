import { createSlice } from "@reduxjs/toolkit";

// object yang menyimpan nilai awal dari state
const initialState = {
  currentUser: null, // Menyimpan data pengguna yang sedang login, dimulai dengan null.
  error: null, // Menyimpan pesan kesalahan jika terjadi error, dimulai dengan null
  loading: false, // Menandakan status pemuatan, dimulai dengan false.
};

// userSlice mendefinisikan "nama slice (name)", "initialState", dan "reducers" yang berisi tiga action:
const userSlice = createSlice({
  name: "user", // nama slice
  initialState, // nilai awal dari state untuk slice ini

  // kumpulan fungsi untuk mengubah state berdasarkan aksi (actions).
  reducers: {
    // Mengubah "loading" menjadi "true" dan mengatur "error" menjadi "null" saat proses login dimulai.
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    // Mengisi "currentUser" dengan data dari login yang berhasil, mengatur "loading" menjadi "false", dan "error" menjadi "null".
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },

    // mengatur "loading" menjadi "false" dan mengisi "error" dengan pesan kesalahan jika login gagal.
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // mengubah "loading" menjadi "true" dan mengatur "error" menjadi "null" saat proses update data pengguna dimulai
    updateStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    // mengisi "currentUser" dengan data dari update yang berhasil, mengatur "loading" menjadi "false", dan "error" menjadi "null".
    updateSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },

    // mengatur "loading" menjadi "false" dan mengisi "error" dengan pesan kesalahan jika update gagal.
    updateFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // mengubah "loading" menjadi "true" dan mengatur "error" menjadi "null" saat proses update data pengguna dimulai
    deleteUserStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    // menghapus "currentUser" data yang berhasil, mengatur "loading" menjadi "false", dan "error" menjadi "null".
    deleteUserSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },

    // menangani situasi ketika penghapusan pengguna gagal.
    deleteUserFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    signoutSuccess: (state) => {
      state.currentUser = null;
      state.error = null;
      state.loading = false;
    },
  },
});

// mengekspor actions sehingga dapat digunakan di komponen React untuk memicu perubahan state.
export const {
  signInStart,
  signInSuccess,
  signInFailure,
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signoutSuccess,
} = userSlice.actions;

// mengekspor reducer sebagai default export sehingga dapat digunakan di Redux store untuk mengelola state terkait pengguna.
export default userSlice.reducer;
