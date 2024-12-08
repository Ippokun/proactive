import React, { createContext, useContext, useState } from "react";

// Define the type for job post data
type JobPostData = {
  title: string;
  skills: string[];
  deadline: string;
  subDeadline?: string;
  projectType: "" | "large" | "medium" | "small";
  budgetType: "hourly" | "project" | "";
  hourlyRateFrom: number | null;
  hourlyRateTo: number | null;
  projectMaxBudget: number | null;
  description: string;
  attachments: File[]; // Store file URLs or names instead of file objects
  [key: string]: any; // For additional steps/data
};

type JobPostContextType = {
  jobPostData: JobPostData;
  setJobPostData: React.Dispatch<React.SetStateAction<JobPostData>>;
};

const JobPostContext = createContext<JobPostContextType | undefined>(undefined);

export const JobPostProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobPostData, setJobPostData] = useState<JobPostData>({
    title: "",
    skills: [],
    deadline: "",
    subDeadline: "",
    projectType: "",
    budgetType: "",
    hourlyRateFrom: null,
    hourlyRateTo: null,
    projectMaxBudget: null,
    description: "",
    attachments: [], // Initialize with empty array for file URLs
  });

  return (
    <JobPostContext.Provider value={{ jobPostData, setJobPostData }}>
      {children}
    </JobPostContext.Provider>
  );
};

export const useJobPostContext = () => {
  const context = useContext(JobPostContext);
  if (!context) {
    throw new Error("useJobPostContext must be used within a JobPostProvider");
  }
  return context;
};
