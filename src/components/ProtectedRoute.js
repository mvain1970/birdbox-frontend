import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

export default function ProtectedRoute({ children }) {
  const { jwt } = useContext(AuthContext);

  if (!jwt) {
    return <Navigate to="/login" replace />;
  }

  return children;
}