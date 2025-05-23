"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface UserProviderProps {
  children: ReactNode;
}

// Updated UserContextType to include 'roleInMongolian'
type UserContextType = {
  isLoggedIn: boolean;
  role: string;
  username: string;
  lastname: string;
  email: string;
  userSecret: string;
  userId: number | null;
  roleInMongolian: string; // Add this line
  setUser: (user: {
    isLoggedIn: boolean;
    role: string;
    username: string;
    lastname: string;
    email: string;
    userSecret: string;
    userId: number | null;
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

// Function to map role to Mongolian translation
const mapRoleToMongolian = (role: string) => {
  switch (role) {
    case 'client':
      return 'Фрилансе хөлслөгч'; // Mongolian equivalent for client
    case 'freelancer':
      return 'Фрилансер'; // Mongolian equivalent for freelancer
    default:
      return role; // Default to English if unknown role
  }
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<{
    isLoggedIn: boolean;
    role: string;
    username: string;
    lastname: string;
    email: string;
    userSecret: string;
    userId: number | null;
  }>({
    isLoggedIn: false,
    role: "",
    username: "",
    lastname: "",
    email: "",
    userSecret: "",
    userId: null,
  });

  useEffect(() => {
    // Retrieve data from localStorage
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    const storedUsername = localStorage.getItem("firstName");
    const storedLastname = localStorage.getItem("lastName");
    const storedEmail = localStorage.getItem("email");
    const storedUserSecret = localStorage.getItem("userSecret");
    const storedUserId = localStorage.getItem("userId");

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
      lastname: storedLastname || "", // Provide empty string as fallback for username
      email: storedEmail || "", // Provide empty string as fallback for username
      userSecret: storedUserSecret || "", // Provide empty string as fallback for userSecret
      userId: parsedUserId, // Set userId to null if invalid
    });
  }, []);

  return (
    <UserContext.Provider value={{
      ...user,
      setUser,
      roleInMongolian: mapRoleToMongolian(user.role) // Add this to the provider value
    }}>
      {children}
    </UserContext.Provider>
  );
};
  