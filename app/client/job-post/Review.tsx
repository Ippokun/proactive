import React, { useState } from "react";
import { useJobPostContext } from "./JobPostContext";
import { useRouter } from "next/router"; 

const Review: React.FC = () => {
  const { jobPostData, setJobPostData } = useJobPostContext();
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({});

  // Toggle edit mode for a specific field
  const handleEditToggle = (field: string) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleFieldChange = (field: string, value: string) => {
    setJobPostData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    // Send the job post data to the backend
    const formData = new FormData();
    formData.append("title", jobPostData.title);
    formData.append("description", jobPostData.description);
    formData.append("skills", JSON.stringify(jobPostData.skills));
    formData.append("deadline", jobPostData.deadline);
    formData.append("projectType", jobPostData.projectType);
    formData.append("budgetType", jobPostData.budgetType);
    formData.append("hourlyRateFrom", jobPostData.hourlyRateFrom?.toString() || "");
    formData.append("hourlyRateTo", jobPostData.hourlyRateTo?.toString() || "");
    formData.append("projectMaxBudget", jobPostData.projectMaxBudget?.toString() || "");
    
    try {
      const response = await fetch("/api/jobPost", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Ажлын зар амжилттай илгээгдлээ.");
      } else {
        alert("Алдаа гарлаа.");
      }
    } catch (error) {
      console.error("Error submitting job post:", error);
      alert("Алдаа гарлаа.");
    }
  };

  return (
    <div className="container">
      <h2 className="text-xl font-bold">Ажлын зарын тойм</h2>

      <div className="mt-4">
        <p>
          <strong>Ажлын нэр:</strong>
          {isEditing.title ? (
            <input
              type="text"
              value={jobPostData.title}
              onChange={(e) => handleFieldChange("title", e.target.value)}
              className="border px-2 py-1"
            />
          ) : (
            jobPostData.title
          )}
        </p>
        <button onClick={() => handleEditToggle("title")} className="text-blue-500">
          {isEditing.title ? "Хадгалах" : "Засах"}
        </button>
      </div>

      <div className="mt-4">
        <p>
          <strong>Ажлын тайлбар:</strong>
          {isEditing.description ? (
            <textarea
              value={jobPostData.description}
              onChange={(e) => handleFieldChange("description", e.target.value)}
              className="border px-2 py-1 w-full"
            />
          ) : (
            jobPostData.description
          )}
        </p>
        <button onClick={() => handleEditToggle("description")} className="text-blue-500">
          {isEditing.description ? "Хадгалах" : "Засах"}
        </button>
      </div>

      <div className="mt-4">
        <p><strong>Ур чадвар:</strong> {jobPostData.skills.join(", ")}</p>
        <button onClick={() => handleEditToggle("skills")} className="text-blue-500">
          Засах
        </button>
      </div>

      <div className="mt-4">
        <p><strong>Төлөвлөсөн дуусах хугацаа:</strong> {jobPostData.deadline}</p>
        <button onClick={() => handleEditToggle("deadline")} className="text-blue-500">
          Засах
        </button>
      </div>

      <div className="mt-4">
        <p><strong>Төслийн төрөл:</strong> {jobPostData.projectType}</p>
        <button onClick={() => handleEditToggle("projectType")} className="text-blue-500">
          Засах
        </button>
      </div>

      <div className="mt-6">
        <button onClick={handleSubmit} className="bg-blue-500 text-white p-2 rounded-md">Илгээх</button>
      </div>
    </div>
  );
};

export default Review;
