"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "../../context/UserContext";

interface Job {
  id: string;
  title: string;
  budget_type: "hourly" | "project";
  hourly_rate_from?: number;
  hourly_rate_to?: number;
  project_max_budget?: number;
}

const ProposalPage: React.FC = () => {
  const searchParams = useSearchParams();
  const jobId = searchParams?.get("jobId");

  // Access user context (freelancerId and role)
  const { userId, role } = useUser();
  console.log("User ID from context:", userId);
  console.log("Role from context:", role);

  const [job, setJob] = useState<Job | null>(null);
  const [proposalLetter, setProposalLetter] = useState<string>(""); // Freelancer's proposal letter
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (jobId) {
        try {
          const response = await fetch(`http://localhost:4000/api/jobPost/${jobId}`);
          if (!response.ok) {
            throw new Error("Failed to fetch job details.");
          }
          const data: Job = await response.json();
          setJob(data);
        } catch (error) {
          setError(error instanceof Error ? error.message : "An error occurred");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchJobDetails();
  }, [jobId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!job || !proposalLetter) {
        setError("Job details or proposal letter are missing.");
        return;
    }

    if (role !== "freelancer") {
      setError("You must be logged in as a freelancer to submit a proposal.");
      return;
    }

    if (!userId) {
      setError("Freelancer ID is missing.");
      return;
    }

    const bidAmount = job.budget_type === "hourly" ? job.hourly_rate_to : job.project_max_budget;

    try {
        const response = await fetch(`http://localhost:4000/api/application`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                freelancer_id: userId,
                jobpost_id: job.id,
                job_title: job.title,
                proposal: proposalLetter,
                bid: bidAmount,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to submit application.");
        }

        const result = await response.json();
        // Handle success (e.g., show a success message or redirect)
        alert("Application submitted successfully!");
    } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold">Loading job details...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold text-red-500">
          Error: {error}
        </h1>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold">Job not found.</h1>
      </div>
    );
  }

  const calculateFees = (amount: number) => ({
    fee: (amount * 0.05).toFixed(2),
    net: (amount * 0.95).toFixed(2),
  });

  const renderBudgetCard = () => {
    let budgetDetails;

    if (job.budget_type === "hourly" && job.hourly_rate_to) {
      const { fee, net } = calculateFees(job.hourly_rate_to);
      budgetDetails = (
        <>
          <p>
            <strong>Төлбөрийн төрөл:</strong> Цагаар
          </p>
          <p>
            <strong>Цагийн хөлс:</strong> {job.hourly_rate_to}₮
          </p>
          <p>
            <strong>Системийн шимтгэл (5%):</strong> {fee}₮
          </p>
          <p>
            <strong>Цэвэр ашиг:</strong> {net}₮
          </p>
        </>
      );
    } else if (job.budget_type === "project" && job.project_max_budget) {
      const { fee, net } = calculateFees(job.project_max_budget);
      budgetDetails = (
        <>
          <p>
            <strong>Төлбөрийн төрөл:</strong> Төслөөр
          </p>
          <p>
            <strong>Төслийн төсөв:</strong> {job.project_max_budget}₮
          </p>
          <p>
            <strong>Системийн шимтгэл (5%):</strong> {fee}₮
          </p>
          <p>
            <strong>Цэвэр ашиг:</strong> {net}₮
          </p>
        </>
      );
    }

    return (
      <div className="border p-6 rounded-lg shadow-md space-y-2">
        <h2 className="text-lg font-bold">Төсвийн мэдээлэл</h2>
        {budgetDetails}
      </div>
    );
  };

  return (
    <div className="p-8 space-y-8">
      {/* Proposal */}
        <h1 className="text-3xl font-bold">Хүсэлт илгээх</h1>


      {/* Budget Card */}
      {renderBudgetCard()}

      {/* Proposal Form */}
      <div className="border p-6 rounded-lg shadow-md bg-white space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="proposalLetter"
              className="block text-lg font-medium mb-2"
            >
              Саналын захидал
            </label>
            <textarea
              id="proposalLetter"
              value={proposalLetter}
              onChange={(e) => setProposalLetter(e.target.value)}
              placeholder="Write your proposal letter"
              rows={6}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="flex justify-between space-x-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
            >
              Санал илгээх
            </button>
            <button
              type="button"
              className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition duration-300"
            >
              Болих
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProposalPage;
