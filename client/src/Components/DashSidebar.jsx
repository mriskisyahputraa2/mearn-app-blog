import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiAnnotation,
  HiChartPie,
} from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";

export default function DashSidebar() {
  const location = useLocation(); // mengambil infomasi lokasi saat ini dan query string
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  // menjalankan location.search untuk mengambil query string
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search); // untuk mengambil parameter query dari URL. dalam hal ini, mencari parameter (tab)
    const tabFormUrl = urlParams.get("tab"); // mengambil nilai dari parameter "tab" di URL. Misalnya, jika URL adalah ...?tab=profile,

    // validasi, Jika "tabFormUrl" memiliki nilai, state "tab" diperbarui dengan nilai tersebut.
    if (tabFormUrl) {
      setTab(tabFormUrl);
    }
  }, [location.search]);

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
      <Sidebar className="w-full md:w-56">
        <Sidebar.Items>
          <Sidebar.ItemGroup className="flex flex-col gap-1">
            <Link to="/dashboard?tab=profile">
              <Sidebar.Item
                as="div"
                active={tab === "profile"}
                icon={HiUser}
                label={currentUser.isAdmin ? "Admin" : "User"}
                labelColor="dark"
              >
                Profile
              </Sidebar.Item>
            </Link>

            {currentUser && currentUser.isAdmin && (
              <>
                <Link to="/dashboard?tab=dash">
                  <Sidebar.Item
                    as="div"
                    active={tab === "dash" || !tab}
                    icon={HiChartPie}
                  >
                    Dashboard
                  </Sidebar.Item>
                </Link>
                <Link to="/dashboard?tab=posts">
                  <Sidebar.Item
                    as="div"
                    active={tab === "posts"}
                    icon={HiDocumentText}
                    labelColor="dark"
                  >
                    Post
                  </Sidebar.Item>
                </Link>
                <Link to="/dashboard?tab=users">
                  <Sidebar.Item
                    as="div"
                    active={tab === "users"}
                    icon={HiOutlineUserGroup}
                    labelColor="dark"
                  >
                    Users
                  </Sidebar.Item>
                </Link>
                <Link to="/dashboard?tab=comments">
                  <Sidebar.Item
                    as="div"
                    active={tab === "comments"}
                    icon={HiAnnotation}
                    labelColor="dark"
                  >
                    Comments
                  </Sidebar.Item>
                </Link>
              </>
            )}

            <Sidebar.Item
              as="div"
              icon={HiArrowSmRight}
              className="cursor-pointer"
              onClick={handleSignout}
            >
              Sign Out
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </>
  );
}
