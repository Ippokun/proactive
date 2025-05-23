import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { mn } from "date-fns/locale";
import { useJobContext } from "../jobContext";
import { useRouter } from "next/navigation";
import { useUser } from "../../../context/UserContext";
import JobDescriptionModal from "../description/jobDescriptionModal";

const ViewJobPosts = () => {
  const [jobPosts, setJobPosts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJobState] = useState<any>(null);
  const [jobToDelete, setJobToDelete] = useState(null);
  const { userId } = useUser();

  useEffect(() => {
    const fetchClientJobs = async () => {
      try {
        const url = userId
          ? `http://localhost:4000/api/jobPost/all?clientId=${userId}`
          : `http://localhost:4000/api/jobPost/all`;
        const response = await fetch(url);

        if (!response.ok) throw new Error("Failed to fetch job posts");

        const data = await response.json();
        setJobPosts(data);
      } catch (error) {
        console.error("Error fetching client job posts:", error);
      }
    };

    fetchClientJobs();
  }, [userId]);

  const toggleExpanded = (id: number) => {
    setExpandedPosts((prev) => {
      const newSet = new Set(prev);
      newSet.has(id) ? newSet.delete(id) : newSet.add(id);
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

  const handleDeleteJob = async (jobId: number) => {
    try {
      await fetch(`http://localhost:4000/api/jobPost/${jobId}/hide`, {
        method: "PATCH",
      });
      setJobPosts((prev) => prev.filter((job) => job.id !== jobId));
    } catch (error) {
      console.error("Failed to delete job post:", error);
    }
  };

  return (
    <div className="job-posts" style={{ padding: "2rem", margin: "0 auto", maxWidth: "1000px" }}>
      <h1 className="text-2xl font-bold mb-4">Нийтэлсэн ажлын зарууд:</h1>
      {currentPosts.length > 0 ? (
        currentPosts.map((job) => {
          const isExpanded = expandedPosts.has(job.id);
          const descriptionStyle: React.CSSProperties = {
            display: "-webkit-box",
            WebkitLineClamp: isExpanded ? "none" : MAX_LINES.toString(),
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          };
          const formattedDate = formatDistanceToNow(new Date(job.created_at), {
            addSuffix: true,
            locale: mn,
          }).replace("ойролцоогоор ", "");

          return (
            <div
              key={job.id}
              className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-300"
            >
              <div className="flex justify-between items-center mb-2">
                <h2
                  className="text-xl font-semibold cursor-pointer text-blue-600 hover:underline"
                  onClick={() => handleJobClick(job)}
                >
                  {job.title}
                </h2>
                <button
                  className="text-sm text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteJob(job.id)}
                >
                  Устгах
                </button>
              </div>
              <p className="text-sm text-gray-400 mb-2">
                Нийтэлсэн огноо: {formattedDate}
              </p>
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
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Дараах
        </button>
      </div>

      {isModalOpen && selectedJob && (
        <JobDescriptionModal
          job={selectedJob}
          onClose={handleModalClose}
          setJobPosts={setJobPosts}
        />
      )}
    </div>
  );
};

export default ViewJobPosts;
