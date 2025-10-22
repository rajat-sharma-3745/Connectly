import React from "react";
import AppLayout from "./layout/AppLayout";
import { useDispatch, useSelector } from "react-redux";
import Avatar from "./Avatar";
import { setSelectedChatUser } from "../redux/slices/authSlice";
import { FaMessage } from "react-icons/fa6";
import Messages from "./Messages";
import { useState } from "react";
import { useToast } from "../context/ToastContext";
import { axiosInstance } from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";
import { setChatSidebar, setIsChatOpen, setMessages } from "../redux/slices/chatSlice";
import { useEffect } from "react";
import { setMessageAlert } from "../redux/slices/messageSlice";
import { useSocket } from "../socket";
import { useCallback } from "react";
import { useSocketEvents } from "../hooks/useSocket";
import { useRef } from "react";
import { FaBars } from "react-icons/fa";

const ChatPage = () => {
  const toast = useToast();
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const { user, suggestedUsers, selectedChatUser } = useSelector((s) => s.auth);
  const { onlineUsers, messages,isChatOpen,chatSidebar } = useSelector((s) => s.chat);
  const { newMessagesAlert } = useSelector((s) => s.message);
  const dispatch = useDispatch();
  const sidebarRef = useRef(null);
//   const toggleSidebar = () => {
//    dispatch(setChatSidebar(!chatSidebar))
//   };
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        dispatch(setChatSidebar(false))
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const sendMessageHandler = async (id) => {
    try {
      const { data } = await axiosInstance.post(API_PATHS.MESSAGE.SEND(id), {
        message,
      });
      if (data?.success) {
        console.log(data.newMessage);
        dispatch(setMessages([...messages, data?.newMessage]));
        setMessage("");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  useEffect(() => {
    dispatch(setIsChatOpen(true));
    return () => {
      dispatch(setSelectedChatUser(null));
      dispatch(setIsChatOpen(false));
    };
  }, [isChatOpen]);
  const newMessageAlertHandler = useCallback(
    (data) => {
      dispatch(setMessageAlert(data));
    },
    [dispatch]
  );
  const eventHandler = {
    newMessageAlert: newMessageAlertHandler,
  };
  useSocketEvents(socket, eventHandler);
  return (
    <div className="h-screen flex ">
      <div
        ref={sidebarRef}
        className={` bg-white border-r border-gray-200 fixed left-0 top-0 z-10 md:static md:translate-x-0 ${
          chatSidebar ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <section className="lg:w-80 md:w-56 w-40 my-3">
          <h1 className="font-bold mb-4 px-3 text-xl pl-4">{user?.username}</h1>
          <div className="border-t border-gray-300 w-full h-1"></div>
          <div className="overflow-y-auto h-[80vh]">
            {suggestedUsers.map((suggestedUser) => {
              const isOnline = onlineUsers.includes(suggestedUser?._id);
              const newMsgAlert = newMessagesAlert.find(
                (item) => item.userId === suggestedUser?._id
              );
              // console.log(newMsgAlert)
              return (
                <div
                  key={suggestedUser?._id}
                  onClick={() =>{ dispatch(setSelectedChatUser(suggestedUser));dispatch(setChatSidebar(false))}}
                  className="flex relative gap-3 p-3 items-center cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center justify-between p-1 w-full">
                    <div className="flex items-center gap-2">
                      <Avatar src={suggestedUser?.profilePicture} />
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {suggestedUser?.username}
                        </span>
                        <span
                          className={`text-xs font-bold ${
                            isOnline ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {isOnline ? "Online" : "Offline"}
                        </span>
                      </div>
                    </div>

                    {newMsgAlert && (
                      <>
                        <p className="text-xs absolute right-3 p-1 bg-green-400 rounded-sm hidden md:block  ">
                          {newMsgAlert.count} new messages
                        </p>
                        <p className="md:hidden text-xs absolute right-3 px-2 py-newMsgAlert.count bg-green-400 rounded-full ">
                          {newMsgAlert.count}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
      {/* <div className="md:hidden ">
        <button onClick={toggleSidebar} className="">
          <FaBars className=" " />
        </button>
      </div> */}

      {selectedChatUser ? (
        <section className="flex-1 border-l border-gray-300 flex flex-col h-full">
          <div className="flex items-center gap-3 px-3 py-2 border-b border-gray-300 sticky top-0 bg-white z-10 ">
            <Avatar size="md" src={selectedChatUser?.profilePicture} />
            <div className="flex flex-col">
              <span>{selectedChatUser?.username}</span>
            </div>
          </div>
          <Messages selectedChatUser={selectedChatUser} />
          <div className="flex items-center p-4 border-t border-gray-300">
            <input
              value={message}
              onChange={({ target }) => setMessage(target.value)}
              type="text"
              className="flex-1 w-full h-full border-none outline-none bg-gray-100 p-2 rounded"
              placeholder="Type Message"
            />
            <button
              onClick={() => sendMessageHandler(selectedChatUser?._id)}
              className="text-white bg-black p-2 rounded-r cursor-pointer"
            >
              Send
            </button>
          </div>
        </section>
      ) : (
        <div className="flex items-center h-screen border-l border-gray-200 justify-center flex-col w-full">
          <FaMessage className="w-32 h-32 " />
          <h1 className="font-semibold text-xl">Your Messages</h1>
          <span>Send a message to start a chat</span>
        </div>
      )}
    </div>
  );
};

export default AppLayout()(ChatPage);
