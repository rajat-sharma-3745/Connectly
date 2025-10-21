import { useEffect, useRef, useState } from "react";
import { FaBars } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import Feed from "./Feed";
import AppLayout from "./layout/AppLayout";
import RightSidebar from "./RightSidebar";

const Home = () => {
  const sidebarRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="flex">
      <div className="grow">
        <Feed />
        <Outlet />
      </div>
      <div
        ref={sidebarRef}
        className={` px-4 border-r border-gray-200 bg-white fixed right-0 top-0 z-10 transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <RightSidebar />
      </div>
      <div className="lg:hidden  p-2">
        <button onClick={toggleSidebar} className="">
          <FaBars className=" " />

        </button>
      </div>
    </div>
  );
};
export default AppLayout()(Home);
