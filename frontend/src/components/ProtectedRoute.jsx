import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({user, children, redirect = "/login" }) => {
//   const { user } = useSelector((state) => state.auth);
  if (!user) {
    return <Navigate to={redirect} />;
  }
  return children;
};

export default ProtectedRoute;
