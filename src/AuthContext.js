import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [jwt, setJwt] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedJwt = localStorage.getItem("jwt");
    if (storedJwt) {
      setJwt(storedJwt);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (jwt) {
      localStorage.setItem("jwt", jwt);
    } else {
      localStorage.removeItem("jwt");
    }
  }, [jwt]);

  return (
    <AuthContext.Provider value={{ jwt, setJwt, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
