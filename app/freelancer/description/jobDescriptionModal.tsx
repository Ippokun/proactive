"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdArrowBack } from "react-icons/md"; // Import the arrow icon from react-icons

interface JobDescriptionModalProps {
  job: any;
  onClose: () => void;
  setJobPosts: React.Dispatch<React.SetStateAction<any[]>>; // Pass the state updating function to handle hiding job posts
}

const JobDescriptionModal: React.FC<JobDescriptionModalProps> = ({ job, onClose, setJobPosts }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedJob, setEditedJob] = useState(job);
  const router = useRouter();

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedJob((prevJob: any) => ({
      ...prevJob,
      [name]: value,
    }));
  };

  // Handle the form submission for editing the job post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Send the updated job data to the backend
      const response = await fetch(`http://localhost:4000/api/jobPost/${job.id}`, {
        method: "PATCH", // Or "PUT" if you prefer to replace the resource
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedJob),
      });

      if (response.ok) {
        // If the update is successful, update the job post in the UI
        setJobPosts((prevPosts) =>
          prevPosts.map((post) => (post.id === job.id ? editedJob : post))
        );
        setIsEditing(false); // Close the edit form
      } else {
        console.error("Failed to update job post");
      }
    } catch (error) {
      console.error("Error updating job post:", error);
    }
  };
  
  // Disable scroll on the body when the modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden"; // Disable scrolling on the main page
    return () => {
      document.body.style.overflow = "auto"; // Enable scrolling when modal is closed
    };
  }, []);

  // Navigate to apply/proposal page when clicking "Apply Now"
  const handleApplyNow = () => {
    router.push(`/freelancer/apply?jobId=${job.id}`);
  };
  
  return (
    <div
      className="fixed inset-0 flex items-start justify-end bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-[70%] h-full p-8 rounded-l-lg shadow-lg overflow-hidden relative"
        onClick={(e) => e.stopPropagation()} // Prevent click from closing modal
      >
        {/* Header with Back Button and Action Buttons */}
        <div className="sticky top-0 z-10 bg-white p-4 shadow-md border-b flex justify-between items-center">
          <button
            className="text-gray-600 p-2"
            onClick={onClose}
          >
            <MdArrowBack size={28} /> {/* Arrow icon */}
          </button>
        </div>

        {/* Header Section with Title and Apply Now Button */}
        <div className="flex justify-between items-center mt-8 mb-4">
          {/* Job Title */}
          <h2 className="text-3xl font-semibold">{job.title}</h2>
          
          {/* Apply Now Button */}
          <button
            className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition"
            onClick={handleApplyNow}
          >
            Apply Now
          </button>
        </div>

        {/* Job Details */}
        <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto">
          {/* Display each job field with a bordered frame */}
          <div className="border p-4 rounded-lg">
            <strong className="block text-lg">Тодорхойлолт:</strong>
            <p>{job.description}</p>
          </div>
          <div className="border p-4 rounded-lg">
            <strong className="block text-lg">Чадвар:</strong>
            <p>{job.skills.join(", ")}</p>
          </div>
          <div className="border p-4 rounded-lg">
            <strong className="block text-lg">Тохируулах хугацаа:</strong>
            <p>{job.deadline}</p>
          </div>
          <div className="border p-4 rounded-lg">
            <strong className="block text-lg">Дэд хугацаа:</strong>
            <p>{job.sub_deadline}</p>
          </div>
          <div className="border p-4 rounded-lg">
            <strong className="block text-lg">Төслийн төрөл:</strong>
            <p>{job.project_type}</p>
          </div>
          <div className="border p-4 rounded-lg">
            <strong className="block text-lg">Төсвийн төрөл:</strong>
            <p>{job.budget_type}</p>
          </div>

          {/* Conditional rendering based on budget_type */}
          {job.budget_type === "hourly" ? (
            <>
              <div className="border p-4 rounded-lg">
                <strong className="block text-lg">Цагийн хөлс (Эхлэх):</strong>
                <p>{job.hourly_rate_from}</p>
              </div>
              <div className="border p-4 rounded-lg">
                <strong className="block text-lg">Цагийн хөлс (Төгсгөл):</strong>
                <p>{job.hourly_rate_to}</p>
              </div>
            </>
          ) : (
            <div className="border p-4 rounded-lg">
              <strong className="block text-lg">Төслийн хамгийн их төсөв:</strong>
              <p>{job.project_max_budget}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDescriptionModal;
