"use client";

import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { mn } from "date-fns/locale";
import { useJobContext } from "../jobContext";
import { useRouter } from "next/navigation";
import JobDescriptionModal from "../description/jobDescriptionModal";

const ViewJobPosts = () => {
  const [jobPosts, setJobPosts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const postsPerPage = 5; // Number of job posts per page
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set()); 
  const { setSelectedJob } = useJobContext();
  const router = useRouter(); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJobState] = useState<any>(null); // Store selected job for modal

  useEffect(() => {
    const fetchJobPosts = async () => {
      const response = await fetch("http://localhost:4000/api/jobPost/all");
      const data = await response.json();
      setJobPosts(data);
    };

    fetchJobPosts();
  }, []);

  const toggleExpanded = (id: number) => {
    setExpandedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id); // Collapse the description
      } else {
        newSet.add(id); // Expand the description
      }
      return newSet;
    });
  };

  const MAX_LINES = 3;

  // Pagination logic
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = jobPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(jobPosts.length / postsPerPage);

  const handleJobClick = (job: any) => {
    setSelectedJobState(job); 
    setIsModalOpen(true); 
  };

  const handleModalClose = () => {
    setIsModalOpen(false); 
    setSelectedJobState(null); 
  };

  return (
    <div
      className="job-posts" 
      style={{ padding: "2rem", margin: "0 auto", maxWidth: "1000px" }}
    >
      <h1 className="text-2xl font-bold mb-4">Нийтэлсэн ажлын зарууд:</h1>
      {currentPosts.length > 0 ? (
        currentPosts.map((job) => {
          const isExpanded = expandedPosts.has(job.id);
          const descriptionStyle: React.CSSProperties = {
            display: "-webkit-box",
            WebkitLineClamp: isExpanded ? "none" : MAX_LINES.toString(),
            WebkitBoxOrient: "vertical" as any, // ugugdliin turliin aldaa vertical deer any 
            overflow: "hidden",
          };
          const formattedDate = formatDistanceToNow(new Date(job.created_at), {
            addSuffix: true,
            locale: mn,
          });
        
          // "ойролцоогоор" baihgui bolhoh
          const cleanedDate = formattedDate.replace("ойролцоогоор ", "");

          return (
            <div
              key={job.id}
              className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-300"
            >
              {/* Header Section */}
              <div className="flex justify-between items-center mb-2">
                <h2
                  className="text-xl font-semibold cursor-pointer text-blue-600 hover:underline"
                  onClick={() => handleJobClick(job)}
                >
                  {job.title}
                </h2>
                <div>
                  {/* <button
                    className="text-sm text-gray-500 hover:text-gray-700 mr-2"
                    onClick={() => console.log(`Edit job ID: ${job.id}`)}
                  >
                    Засах
                  </button> */}
                  <button
                    className="text-sm text-red-500 hover:text-red-700"
                    onClick={async () => {
                      try {
                        // Send request to hide the job post
                        await fetch(`http://localhost:4000/api/jobPost/${job.id}/hide`, {
                          method: "PATCH",
                        });

                        // Update the local state to hide the job post in the UI
                        setJobPosts((prev) => prev.filter((post) => post.id !== job.id));
                      } catch (error) {
                        console.error("Failed to hide job post:", error);
                      }
                    }}
                  >
                    Устгах
                  </button>
                </div>
              </div>
              {/* Posted Time */}
              <p className="text-sm text-gray-400 mb-2">
                Нийтэлсэн огноо: {cleanedDate}
              </p>
              {/* Description */}
              <p className="text-gray-700 mb-2" style={descriptionStyle}>
                {job.description}
              </p>
              <button
                className="text-sm text-blue-500 hover:underline"
                onClick={() => toggleExpanded(job.id)}
              >
                {isExpanded ? "Хураах" : "Дэлгэрэнгүй"}
              </button>
            </div>
          );
        })
      ) : (
        <p className="text-gray-500">Ажлын зар нийтлэгүй байна.</p>
      )}

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button
          className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Өмнөх
        </button>
        <p className="text-sm">
          Хуудас {currentPage} / {totalPages}
        </p>
        <button
          className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded disabled:opacity-50"
          disabled={currentPage === totalPages}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
        >
          Дараах
        </button>
      </div>
       {/* Modal */}
      {isModalOpen && selectedJob && (
        <JobDescriptionModal job={selectedJob} onClose={handleModalClose} setJobPosts={setJobPosts} />
      )}
    </div>
  );
};

export default ViewJobPosts;



