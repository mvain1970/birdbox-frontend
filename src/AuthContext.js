import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [jwt, setJwtState] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("jwt");
    if (stored) {
      setJwtState(stored);
    }
    setLoading(false);
  }, []);

  const setJwt = (token) => {
    setJwtState(token);
    if (token) {
      localStorage.setItem("jwt", token);
    } else {
      localStorage.removeItem("jwt");
    }
  };

  return (
    <AuthContext.Provider value={{ jwt, setJwt, loading }}>
      {children}
    </AuthContext.Provider>
  );
};