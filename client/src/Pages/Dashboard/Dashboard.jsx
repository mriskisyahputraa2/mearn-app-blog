import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../../Components/DashSidebar";
import DashProfile from "../../Components/DashProfile";
import DashPosts from "../../Components/DashPosts";
import DashUsers from "../../Components/DashUser";
import DashComment from "../../Components/DashComments";
import DashboardCom from "../../Components/DashboardCom";

export default function Dashboard() {
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
      <div className="min-h-screen flex flex-col md:flex-row">
        <div className="md:w-56">
          {/* Start Sidebar */}
          <DashSidebar />
          {/* End Sidebar */}
        </div>

        {/* Profile */}
        {/* jika nilai tab adalah "profile", maka komponen DashProfile akan di-render, yang menampilkan profil pengguna. */}
        {tab === "profile" && <DashProfile />}

        {/* Post List*/}
        {tab === "posts" && <DashPosts />}

        {/* Users List*/}
        {tab === "users" && <DashUsers />}

        {/* Comment List */}
        {tab === "comments" && <DashComment />}

        {/* dashboard comp */}
        {tab === "dash" && <DashboardCom />}
      </div>
    </>
  );
}
