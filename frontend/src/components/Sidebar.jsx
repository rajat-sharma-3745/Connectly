import React, { useState } from "react";
import { IoMdHome } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { MdOutlineExplore } from "react-icons/md";
import { BiSolidMessageSquareDetail } from "react-icons/bi";
import { IoNotifications } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import { IoMdLogOut } from "react-icons/io";
import Avatar from "./Avatar";
import { useToast } from "../context/ToastContext";
import { axiosInstance } from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";
import CreatePost from "./CreatePost";
import { useRef } from "react";
import { useEffect } from "react";
import logo from '../assets/logo.png'


const Sidebar = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [openNotificationDialog, setOpenNotificationDialog] = useState(false);
  const notificationRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const { likeNotification } = useSelector((state) => state.notification);
  const [postDialogOpen, setPostDialogOpen] = useState(false);
  const { newMessagesAlert } = useSelector((s) => s.message);

  const sidebarItems = [
    { icon: <IoMdHome size={24} />, text: "Home" },
    { icon: <BiSolidMessageSquareDetail size={24} />, text: "Messages" },
    { icon: <IoNotifications size={24} />, text: "Notifications" },
    { icon: <FaPlus size={24} />, text: "Create" },
    { icon: <Avatar size="sm" src={user?.profilePicture} />, text: "Profile" },
    { icon: <IoMdLogOut size={24} />, text: "Logout" },
  ];

  const logoutHandler = async () => {
    try {
      const res = await axiosInstance.get(API_PATHS.AUTH.LOGOUT);
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(logoutUser());
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const submitHandler = (text) => {
    if (text === "Logout") logoutHandler();
    else if (text === "Create") setPostDialogOpen(true);
    else if (text === "Profile") navigate(`/profile/${user?._id}`);
    else if (text === "Home") navigate(`/`);
    else if (text === "Messages") navigate(`/chat`);
    else if (text === "Notifications") setOpenNotificationDialog((p) => !p);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target)
      ) {
        setOpenNotificationDialog(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return (
    <div className="flex flex-col h-screen ">
      <div className=" w-20 mx-auto">
            <img src={logo} alt="" className="w-full h-auto object-cover" />
          </div>
      <div className="">
        {sidebarItems.map((item, index) => (
          <div
            onClick={() => submitHandler(item.text)}
            key={index}
            className="flex items-center gap-2 text-xl font-medium relative hover:bg-gray-200 p-2 rounded-md transition-transform duration-300 cursor-pointer my-4"
          >
            {item.icon}
            <span>{item.text}</span>
            {item.text === "Notifications" && likeNotification.length > 0 && (
              <div className="h-5 flex justify-center items-center text-sm w-5 p-1 bg-red-500 text-white rounded-full absolute right-1 top-3">
                {likeNotification.length}
              </div>
            )}
            {item.text === "Messages" && newMessagesAlert.length > 0 && (
              <div className="h-5 flex justify-center items-center text-sm w-5 p-1 bg-red-500 text-white rounded-full absolute right-1 top-3">
                {newMessagesAlert.length}
              </div>
            )}
            {item.text === "Notifications" && openNotificationDialog && (
              <div
                ref={notificationRef}
                className="absolute text-xs  top-10 left-50 shadow-sm p-2 rounded-sm bg-white"
              >
                {likeNotification.length === 0 ? (
                  <p className="w-fit">No new notifications</p>
                ) : (
                  likeNotification.map((notification) => {
                    return (
                      <div
                        key={notification.userId}
                        className="w-48 flex items-center gap-3 "
                      >
                        <Avatar
                          src={notification?.userDetails?.profilePicture}
                        />
                        <p className="text-sm font-bold">
                          {notification?.userDetails?.username} liked your post{" "}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <CreatePost open={postDialogOpen} setOpen={setPostDialogOpen} />
    </div>
  );
};

export default Sidebar;
