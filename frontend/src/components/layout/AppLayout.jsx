import { useCallback, useEffect, useRef, useState } from "react";
import { FaBars } from "react-icons/fa";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSocketEvents } from "../../hooks/useSocket";
import useGetAllPosts from "../../hooks/useGetAllPosts";
import useGetSuggestedUser from "../../hooks/useGetSuggestedUser";
import { setChatSidebar, setOnlineUsers } from "../../redux/slices/chatSlice";
import { setMessageAlert } from "../../redux/slices/messageSlice";
import { setLikeNotifications } from "../../redux/slices/notiSlice";
import { useSocket } from "../../socket";
import Sidebar from "../Sidebar";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const socket = useSocket();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const sidebarRef = useRef(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => {
      setSidebarOpen(!sidebarOpen);
    };
    const { isChatOpen, chatSidebar } = useSelector((state) => state.chat);
    const toggleChatSidebar = () => {
      dispatch(setChatSidebar(true));
    };
    const { user, loading } = useSelector((state) => state.auth);
    useGetAllPosts();
    useGetSuggestedUser();
    // useEffect(()=>{

    //   if(!user){
    //     navigate('/login');
    //   }
    // },[])
    // if(!user) return null;

    const onlineUserHandler = useCallback(
      (data) => {
        dispatch(setOnlineUsers(data));
      },
      [dispatch]
    );
    const notificationHandler = useCallback(
      (data) => {
        dispatch(setLikeNotifications(data));
      },
      [dispatch]
    );
    const newMessageAlertHandler = useCallback(
      (data) => {
        dispatch(setMessageAlert(data));
      },
      [dispatch]
    );

    const eventHandler = {
      getOnlineUsers: onlineUserHandler,
      notification: notificationHandler,
      newMessageAlert: newMessageAlertHandler,
    };
    useSocketEvents(socket, eventHandler);
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
          setSidebarOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    if (loading) return <div>Loading....</div>;
    return (
      <div className="flex h-screen">
        <div
          ref={sidebarRef}
          className={`w-56 px-4 border-r border-gray-200 bg-white fixed left-0 top-0 z-50 md:static md:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar />
        </div>
        <div className="md:hidden border-r flex flex-col gap-4 border-gray-200  p-4">
          <button onClick={toggleSidebar} className="">
            <FaBars className=" " />
          </button>
          {isChatOpen && (
            <button onClick={toggleChatSidebar} className="">
              <IoChatbubbleEllipses className=" " />
            </button>
          )}
        </div>
        <div className="flex-1 overflow-y-auto">
          <WrappedComponent {...props} />
        </div>
      </div>
    );
  };
};

export default AppLayout;
