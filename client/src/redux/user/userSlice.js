import { createSlice } from "@reduxjs/toolkit";

// object yang menyimpan nilai awal dari state
const initialState = {
  currentUser: null, // Menyimpan data pengguna yang sedang login, dimulai dengan null.
  error: null, // Menyimpan pesan kesalahan jika terjadi error, dimulai dengan null
  loading: false, // Menandakan status pemuatan, dimulai dengan false.
};

// userSlice mendefinisikan "nama slice (name)", "initialState", dan "reducers" yang berisi tiga action:
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // login jalan(signInStart), mengubah (loading menjadi "true"),
    // mengatur (error menjadi "null")
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    // login berhasil(signInSuccess), mengisi (currentUser dengan data yang berhasil login)
    // mengubah (loading menjadi "false")
    // mengatur (error menjadi "null")
    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },

    // login gagal(signInFailure), Mengubah (loading menjadi "false") dan (mengisi error dengan pesan kesalahan jika sign-in gagal).
    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// action signInStart, signInSuccess, dan signInFailure diekspor agar bisa digunakan di komponen lain.
export const { signInStart, signInSuccess, signInFailure } = userSlice.actions;

// Reducer dari userSlice diekspor sebagai default untuk digunakan di store Redux
export default userSlice.reducer;
