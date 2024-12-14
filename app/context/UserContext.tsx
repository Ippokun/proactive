"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface UserProviderProps {
  children: ReactNode;
}

type UserContextType = {
  isLoggedIn: boolean;
  role: string;
  username: string;
  userSecret: string;
  setUser: (user: {
    isLoggedIn: boolean;
    role: string;
    username: string;
    userSecret: string;
  }) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState({
    isLoggedIn: false,
    role: "",
    username: "",
    userSecret: "",
  });

  useEffect(() => {
    // This code runs only on the client side
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedUsername = localStorage.getItem("username");
    const storedUserSecret = localStorage.getItem("userSecret");

    setUser({
      isLoggedIn: storedToken !== null && storedRole !== null,
      role: storedRole || "",
      username: storedUsername || "",
      userSecret: storedUserSecret || "",
    });
  }, []);

  return (
    <UserContext.Provider value={{ ...user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
