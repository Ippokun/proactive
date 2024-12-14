// JobContext.tsx
"use client";
import React, { createContext, useState, useContext } from "react";

const JobContext = createContext<any>(null);

export const JobProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedJob, setSelectedJob] = useState(null);

  return (
    <JobContext.Provider value={{ selectedJob, setSelectedJob }}>
      {children}
    </JobContext.Provider>
  );
};

export const useJobContext = () => useContext(JobContext);
