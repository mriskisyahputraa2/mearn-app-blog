import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CallToAction from "../../Components/CallToAction";
import PostCard from "../../Components/PostCard";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/post/getPosts");
      const data = await res.json();
      setPosts(data.posts);
    };
    fetchPosts();
  }, []);

  return (
    <>
      <div className="">
        <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold">Welcome to my Blog</h1>
          <p className="text-gray-500 text-xs sm:text-sm">
            Here you will find various articles and tutorials on topics such as
            such as web development, software engineering, and programming
            languages.
          </p>
          <Link
            to={"/search"}
            className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
          >
            View all posts
          </Link>
        </div>

        {/* view action */}
        <div className="p-3 bg-amber-100 dark:bg-slate-700">
          <CallToAction />
        </div>

        {/* Recent Posts */}
        <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 py-7">
          {posts && posts.length > 0 && (
            <div className="flex flex-col gap-6">
              <h2 className="text-2xl font-semibold text-center">
                Recent Posts
              </h2>

              <div className="flex flex-wrap gap-4">
                {posts.map((post) => (
                  <div
                    key={post._id}
                    className="w-full sm:w-1/3 lg:w-1/4 flex-grow" // Membagi menjadi 3 kolom di layar besar
                  >
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
              <Link
                to={"/search"}
                className="text-lg text-teal-500 hover:underline text-center"
              >
                View all posts
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Home;

// 10.58.55 jam
