import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { server } from "./utils/apiPaths";

const SocketContext = createContext(null);
const SocketProvider = ({ children }) => {
  const socket = useMemo( // we are using useMemo here so that ,socket connection is created only once, and in the subsequent re renders , the same socket instance is used,instead of creating new one
    () =>
      io(server, {
        withCredentials: true,
      }),
    []
  );
  useEffect(() => {
    socket.connect();
    return () => {
      socket.close();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

const useSocket = () => {
  return useContext(SocketContext);
};

export {SocketProvider, useSocket}
