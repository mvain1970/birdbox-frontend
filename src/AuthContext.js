import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [jwt, setJwt] = useState(localStorage.getItem("jwt") || "");

  useEffect(() => {
    if (jwt) {
      localStorage.setItem("jwt", jwt);
    } else {
      localStorage.removeItem("jwt");
    }
  }, [jwt]);

  return (
    <AuthContext.Provider value={{ jwt, setJwt }}>
      {children}
    </AuthContext.Provider>
  );
};
