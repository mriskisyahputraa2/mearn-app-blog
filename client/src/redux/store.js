import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice.js";
import themeReducer from "./thema/themeSlice.js";
import { persistReducer } from "redux-persist"; // Paket ini digunakan untuk menyimpan state Redux di local storage.
import storage from "redux-persist/lib/storage";
import persistStore from "redux-persist/es/persistStore";

// menggabungkan reducers
const rootReducer = combineReducers({
  user: userReducer,
  theme: themeReducer,
});

// persist config, untuk menentukan state disimpan
const persistConfig = {
  key: "root", // Kunci yang digunakan untuk menyimpan state di local storage.
  storage, // Menentukan media penyimpanan, di sini kita menggunakan local storage
  version: 1, //Versi dari state schema yang disimpan. Ini berguna jika ada perubahan pada struktur state di masa depan.
};

// untuk membuat reducer yang bisa menyimpan data ke local storage
const persistedReducer = persistReducer(persistConfig, rootReducer);

// membuat "store" dengan redux toolkit ("configureStore")
export const store = configureStore({
  reducer: persistedReducer, // Reducer yang digunakan dalam store, di sini kita menggunakan persistedReducer.

  // Middleware Redux yang digunakan untuk mengelola proses dispatching actions.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }), // serializableCheck agar Redux tidak memeriksa apakah semua data di store bisa diserialisasi
});

export const persistor = persistStore(store);
