import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useSocketEvents } from "../hooks/useSocket";
import useGetAllMessages from "../hooks/useGetAllMessages";
import { setMessages, setNewMessage } from "../redux/slices/chatSlice";
import { useSocket } from "../socket";
import Avatar from "./Avatar";
import { useEffect } from "react";
import { resetMessageAlert } from "../redux/slices/messageSlice";

const Messages = ({ selectedChatUser }) => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const bottomRef = useRef(null);
  useGetAllMessages();
  const { messages } = useSelector((s) => s.chat);
  const { user } = useSelector((s) => s.auth);
  const newMessageHandler = useCallback(
    (data) => {
      if(data.receiverId!==selectedChatUser?._id)return;
      dispatch(setNewMessage(data));
    },
    [dispatch]
  );
  const eventHandler = {
    newMessage: newMessageHandler,
  };
  useSocketEvents(socket, eventHandler);
  useEffect(() => {
    dispatch(resetMessageAlert(selectedChatUser?._id))
    return () =>{
      dispatch(setMessages([]));
    }
  }, [selectedChatUser]);
   useEffect(() => {
      if (bottomRef.current) {
        bottomRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [messages]);
  return (
    <div className="overflow-y-auto flex-1 p-4">
      <div className="flex justify-center">
        <div className="flex flex-col items-center justify-center ">
          <Avatar size="xl" src={selectedChatUser?.profilePicture} />
          <span>{selectedChatUser?.username}</span>
          <Link to={`/profile/${selectedChatUser?._id}`}>
            {" "}
            <button className="bg-gray-200 my-2 cursor-pointer transition-colors duration-300 text-black font-semibold px-2 py-1 rounded-sm flex items-center justify-center">
              View Profile
            </button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {messages &&
          messages.map((msg, index) => {
            const sameSender = msg?.senderId === user?._id;
            return (
              <div
                key={index}
                className={`flex ${
                  sameSender ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-2 rounded-lg break-words max-wxs text-white ${
                    sameSender ? "bg-sky-500" : "bg-red-400"
                  }`}
                >
                  {msg?.message}
                </div>
                <div ref={bottomRef}/>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Messages;
