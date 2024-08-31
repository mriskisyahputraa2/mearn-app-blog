import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import SignIn from "./Pages/SignIn/SignIn";
import SignUp from "./Pages/SignUp/SignUp";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Project from "./Pages/Projects/Project";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import PrivateRoute from "./Components/PrivateRoute";
import OnlyAdminPrivateRoute from "./Components/OnlyAdminPrivateRoute";
import CreatePost from "./Pages/CreatePost/CreatePost";
import UpdatePost from "./Pages/UpdatePost/UpdatePost";
import PostPage from "./Pages/PostPage/PostPage";

const App = () => {
  return (
    <>
      <BrowserRouter>
        {/* start header top */}
        <Header />
        {/* end header top */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />

          {/* pengguna harus login dulu agar bisa kehalaman dashboard, jika belum route nya masih private(tidak boleh ) */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          <Route element={<OnlyAdminPrivateRoute />}>
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/update-post/:postId" element={<UpdatePost />} />
          </Route>
          <Route path="/projects" element={<Project />} />
          <Route path="/post/:postSlug" element={<PostPage />} />
        </Routes>

        {/* Start Footer */}
        <Footer />
        {/* End Footer */}
      </BrowserRouter>
    </>
  );
};

export default App;
