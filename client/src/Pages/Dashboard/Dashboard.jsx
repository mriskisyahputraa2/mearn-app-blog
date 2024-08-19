import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashSidebar from "../../Components/DashSidebar";
import DashProfile from "../../Components/DashProfile";

export default function Dashboard() {
  const location = useLocation();
  const [tab, setTab] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFormUrl = urlParams.get("tab");

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

        {/* Start Profile */}
        {tab === "profile" && <DashProfile />}
        {/* End Profile */}
      </div>
    </>
  );
}
