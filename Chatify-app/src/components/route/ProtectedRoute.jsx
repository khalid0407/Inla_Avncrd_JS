import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRouted = ({ children }) => {
  const token = sessionStorage.getItem("jwtToken");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRouted;