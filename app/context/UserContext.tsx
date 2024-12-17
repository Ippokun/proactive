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
  userId: number | null; // Ensure this is `number | null`
  setUser: (user: {
    isLoggedIn: boolean;
    role: string;
    username: string;
    userSecret: string;
    userId: number | null; // Ensure this is `number | null` too
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
  const [user, setUser] = useState<{
    isLoggedIn: boolean;
    role: string;
    username: string;
    userSecret: string;
    userId: number | null; // Make sure the state userId is of type `number | null`
  }>({
    isLoggedIn: false,
    role: "",
    username: "",
    userSecret: "",
    userId: null, // Initialize with null
  });

  useEffect(() => {
    // Retrieve data from localStorage
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedUsername = localStorage.getItem("username");
    const storedUserSecret = localStorage.getItem("userSecret");
    const storedUserId = localStorage.getItem("userId");

    console.log("Retrieved from localStorage:");
    console.log("Token:", storedToken);
    console.log("Role:", storedRole);
    console.log("Username:", storedUsername);
    console.log("UserSecret:", storedUserSecret);
    console.log("UserId:", storedUserId);

    // Safely parse userId and set as null if invalid
    const parsedUserId = storedUserId ? parseInt(storedUserId, 10) : null;
    if (parsedUserId === null || isNaN(parsedUserId)) {
      console.error("Invalid user ID in localStorage, setting to null");
    }

    // Set the user state if data is valid
    setUser({
      isLoggedIn: storedToken !== null && storedRole !== null,
      role: storedRole || "", // Provide empty string as fallback for role
      username: storedUsername || "", // Provide empty string as fallback for username
      userSecret: storedUserSecret || "", // Provide empty string as fallback for userSecret
      userId: parsedUserId, // Set userId to null if invalid
    });
  }, []); // Only run once when the component mounts

  return (
    <UserContext.Provider value={{ ...user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
