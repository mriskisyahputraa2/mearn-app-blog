import { Sidebar } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiUser, HiArrowSmRight } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";

export default function DashSidebar() {
  const location = useLocation(); // mengambil infomasi lokasi saat ini dan query string
  const [tab, setTab] = useState("");

  // menjalankan location.search untuk mengambil query string
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search); // untuk mengambil parameter query dari URL. dalam hal ini, mencari parameter (tab)
    const tabFormUrl = urlParams.get("tab"); // mengambil nilai dari parameter "tab" di URL. Misalnya, jika URL adalah ...?tab=profile,

    // validasi, Jika "tabFormUrl" memiliki nilai, state "tab" diperbarui dengan nilai tersebut.
    if (tabFormUrl) {
      setTab(tabFormUrl);
    }
  }, [location.search]);

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
