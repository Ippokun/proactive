"use client";

import Header from "../../../components/header";
import Footer from "../../../components/footer";
import React, { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { mn } from "date-fns/locale";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // Importing the heart icons
import JobDescriptionModal from "../description/jobDescriptionModal";

const FreelanceViewJobPosts = () => {
  const [recentJobPosts, setRecentJobPosts] = useState<any[]>([]); // All recent job posts
  const [savedJobPosts, setSavedJobPosts] = useState<any[]>([]); // Saved job posts
  const [searchQuery, setSearchQuery] = useState(""); // Search input
  const [debouncedQuery, setDebouncedQuery] = useState(""); // Debounced search query
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [selectedJob, setSelectedJob] = useState<any>(null); // Job for modal
  const [loading, setLoading] = useState(false); // Loading state for fetching new posts
  const [page, setPage] = useState(1); // Current page for pagination
  const [activeTab, setActiveTab] = useState("recent"); // Active tab (recent or saved)
  const [expandedPosts, setExpandedPosts] = useState<Set<number>>(new Set()); 

  // Debounce effect for search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // Wait 300ms before updating the debounced query

    return () => clearTimeout(handler); // Cleanup the timeout
  }, [searchQuery]);

  // Fetch job posts with lazy loading
  const fetchJobPosts = async () => {
    if (loading) return; // Prevent multiple fetch requests

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:4000/api/jobPost/all/search?search=${debouncedQuery}&page=${page}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch job posts");
      }
      const data = await response.json();

      // Remove duplicates based on job.id
      setRecentJobPosts((prevPosts) => {
        const newPosts = data.filter((newJob: any) =>
          !prevPosts.some((existingJob: any) => existingJob.id === newJob.id)
        );
        return [...prevPosts, ...newPosts]; // Append new unique posts
      });
    } catch (error) {
      console.error("Error fetching job posts:", error);
    } finally {
      setLoading(false);
    }
  };

  // Detect when the user has scrolled to the bottom
  const handleScroll = () => {
    const bottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 200;
    if (bottom && !loading) {
      setPage((prev) => prev + 1); // Increment page number
    }
  };

  // Fetch job posts when the page changes or search query changes
  useEffect(() => {
    setRecentJobPosts([]); // Clear current posts on search query change
    setPage(1); // Reset to the first page
    fetchJobPosts();
  }, [debouncedQuery]);

  // Fetch more posts when the page changes
  useEffect(() => {
    if (page > 1) {
      fetchJobPosts(); // Fetch next page
    }
  }, [page]);

  // Attach scroll event listener to window
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading]);

  // Modal handlers
  const handleJobClick = (job: any) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setSelectedJob(null);
    setIsModalOpen(false);
  };

  // Handle saving a job post
  const handleSaveJob = (job: any) => {
    setSavedJobPosts((prevSavedPosts) => {
      if (!prevSavedPosts.some((savedJob) => savedJob.id === job.id)) {
        return [...prevSavedPosts, job]; // Add job to saved posts
      }
      return prevSavedPosts.filter((savedJob) => savedJob.id !== job.id); // Remove job from saved posts if already saved
    });
  };

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

  const MAX_LINES = 4;

  return (
    <div>
    <Header />
    <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-2xl font-bold mb-6">Ажлын зар хайх</h1>

        {/* Search Bar */}
        <div className="mb-4">
        <input
            type="text"
            placeholder="Ажлын гарчиг хайх..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        </div>

        {/* Tab Switcher */}
        <div className="flex mb-4">
        <button
            className={`px-4 py-2 mr-2 rounded ${activeTab === "recent" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setActiveTab("recent")}
        >
            Саяхан оруулсан ажлууд
        </button>
        <button
            className={`px-4 py-2 rounded ${activeTab === "saved" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setActiveTab("saved")}
        >
            Хадгалсан ажлууд
        </button>
        </div>

        {/* Job Posts List */}
        <div>
        {(activeTab === "recent" ? recentJobPosts : savedJobPosts).length > 0 ? (
            (activeTab === "recent" ? recentJobPosts : savedJobPosts)
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) // Sort by most recent
            .map((job) => {

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
                const isSaved = savedJobPosts.some((savedJob) => savedJob.id === job.id); // Check if the job is saved

                return (
                <div key={job.id} className="bg-white p-4 rounded shadow mb-4 border">
                    {/* Move the Нийтэлсэн time above the title */}
                    <p className="text-xs text-gray-500">{cleanedDate}</p>

                    <div className="mt-2 flex justify-between items-center">
                    <h2
                        className="text-xl font-semibold text-blue-600 hover:underline cursor-pointer"
                        onClick={() => handleJobClick(job)}
                    >
                        {job.title}
                    </h2>

                    {/* Save Job Icon */}
                    <button
                        onClick={() => handleSaveJob(job)}
                        className="text-xl text-gray-500 hover:text-red-500"
                    >
                        {savedJobPosts.some((savedJob) => savedJob.id === job.id) ? (
                        <FaHeart />
                        ) : (
                        <FaRegHeart />
                        )}
                    </button>
                    </div>
                    <p className="mt-4 mb-4 text-xs text-gray-500">
                    {job.project_type}: {job.deadline}.{" "}
                    {job.budget_type === "hourly" ? (
                        <>
                        Цагийн хөлс: {job.hourly_rate_from}₮ - {job.hourly_rate_to}₮
                        </>
                    ) : (
                        <>
                        Төслийн төсөв: {job.project_max_budget}₮
                        </>
                    )}
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
                    <div className="mt-4 flex flex-wrap gap-2">
                        {job.skills.map((skill: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined, index: React.Key | null | undefined) => (
                            <span key={index} className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded-full">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
                );
            })
        ) : (
            <p className="text-gray-500">Ажлын зар олдсонгүй.</p>
        )}
        </div>

        {/* Loading Spinner */}
        {loading && <p className="text-center">Ажлын зар ачааллаж байна...</p>}

        {/* Modal */}
        {isModalOpen && selectedJob && (
        <JobDescriptionModal
            job={selectedJob}
            onClose={handleModalClose}
            setJobPosts={setRecentJobPosts}
        />
        )}
    </div>
    <Footer />
    </div>
  );
};

export default FreelanceViewJobPosts;
