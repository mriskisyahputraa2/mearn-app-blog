import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Button } from "flowbite-react";
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import SignIn from "./Pages/SignIn/SignIn";
import SignUp from "./Pages/SignUp/SignUp";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Project from "./Pages/Projects/Project";
import Header from "./Components/Header";

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
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Project />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
