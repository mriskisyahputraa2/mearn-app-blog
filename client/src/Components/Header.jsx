import { Avatar, Button, Dropdown, Navbar, TextInput } from "flowbite-react";
import { Link, useLocation } from "react-router-dom";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../redux/thema/themeSlice.js";
import { signoutSuccess } from "../redux/user/userSlice.js";

const Header = () => {
  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user); // mendapatan data pengguna dari proses slice yang berhasil
  const { theme } = useSelector((state) => state.theme); // dark mode

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
      <Navbar className="border-b-2">
        <Link
          to={"/"}
          className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
        >
          <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
            Rizki's
          </span>
          Blog
        </Link>
        <form>
          <TextInput
            type="text"
            placeholder="Search..."
            rightIcon={AiOutlineSearch}
            className="hidden lg:inline"
          />
        </form>
        <Button className="w-12 h-10 lg:hidden" color="gray" pill>
          <AiOutlineSearch />
        </Button>
        <div className="flex gap-2 md:order-2">
          <Button
            className="w-12 h-10 hidden sm:inline"
            color="gray"
            pill
            onClick={() => dispatch(toggleTheme())}
          >
            {/* validasi dark mode */}
            {theme === "light" ? <FaSun /> : <FaMoon />}
          </Button>

          {/* jika pengguna sudah berhasil login munculkan informasi datanya  */}
          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar alt="user" img={currentUser.profilePicture} rounded /> // img ditampilkan
              }
            >
              {/* tampilkan username dan email pengguna */}
              <Dropdown.Header>
                <span className="block text-sm">{currentUser.username}</span>
                <span className="block text-sm font-medium truncate">
                  {currentUser.email}
                </span>
              </Dropdown.Header>

              <Link to={"/dashboard?tab=profile"}>
                <Dropdown.Item>Profile</Dropdown.Item>
              </Link>
              <Dropdown.Divider />
              <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
            </Dropdown>
          ) : (
            // jika pengguna belum login maka, tampilkan button sign In
            <Link to={"/sign-in"}>
              <Button gradientDuoTone="purpleToBlue" outline>
                Sign In
              </Button>
            </Link>
          )}

          {/* Start Toggle Navbar bugger  */}
          <Navbar.Toggle />
          {/* End Toggle Navbar bugger */}
        </div>

        {/* Start Navbar Link desktop and mobile  */}
        <Navbar.Collapse>
          <Navbar.Link active={path === "/"} as={"div"}>
            <Link to="/" className="block w-full">
              Home
            </Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/about"} as={"div"}>
            <Link to="/about" className="block w-full">
              About
            </Link>
          </Navbar.Link>
          <Navbar.Link active={path === "/projects"} as={"div"}>
            <Link to="/projects" className="block w-full">
              Projects
            </Link>
          </Navbar.Link>
        </Navbar.Collapse>
        {/* End Navbar Link desktop and mobile  */}
      </Navbar>
    </>
  );
};

export default Header;
