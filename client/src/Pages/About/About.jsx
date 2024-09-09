import React from "react";

const About = () => {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-2xl mx-auto p-3 text-center">
          {/* judul about */}
          <div className="text-3xl font-semibold text-center my-7">
            <h1>About Rizki'Blog</h1>
          </div>

          {/* about */}
          <div className="text-md text-gray-500 flex flex-col gap-6">
            <p>
              Welcome to Rizki'Blog! This blog was created by Muhammad Rizki
              Syahputra as a personal project to share his thoughts and ideas
              with the world. with the world. Rizki is a developer who loves
              writing about technology, coding, and everything in between.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
