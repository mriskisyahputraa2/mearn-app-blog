import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiUser, HiArrowSmRight } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../redux/user/userSlice";

export default function DashSidebar() {
  const location = useLocation(); // mengambil infomasi lokasi saat ini dan query string
  const [tab, setTab] = useState("");
  const dispatch = useDispatch();

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
      const res = await fetch(`/api/user/signout`, {
        method: "POST",
      });

      const data = res.json();

      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <>
      <Sidebar className="w-full md:w-56">
        <Sidebar.Items>
          <Sidebar.ItemGroup>
            <Link to="/dashboard?tab=profile">
              <Sidebar.Item
                as="div"
                active={tab === "profile"} //  Link yang mengarahkan pengguna ke halaman dashboard dengan parameter query "?tab=profile"
                icon={HiUser}
                label={"User"}
                labelColor="dark"
              >
                Profile
              </Sidebar.Item>
              <Sidebar.Item
                as="div"
                icon={HiArrowSmRight}
                className="cursor-pointer"
                onClick={handleSignout}
              >
                Sign Out
              </Sidebar.Item>
            </Link>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </>
  );
}
