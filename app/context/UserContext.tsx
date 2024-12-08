"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface UserProviderProps {
  children: ReactNode;
}

type UserContextType = {
  isLoggedIn: boolean;
  role: string;
  setUser: (user: { isLoggedIn: boolean; role: string}) => void;
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
  const storedToken = localStorage.getItem('token');
  const storedRole = localStorage.getItem('role');

  const [user, setUser] = useState({
    isLoggedIn: storedToken !== null && storedRole !== null,
    role: storedRole || "",
  });

  return (
    <UserContext.Provider value={{ ...user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
