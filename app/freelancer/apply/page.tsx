"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useUser } from "../../context/UserContext";
import Header from "../../../components/header";

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

  const { userId, role } = useUser();

  const [job, setJob] = useState<Job | null>(null);
  const [proposalLetter, setProposalLetter] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (jobId) {
        try {
          const response = await fetch(`http://localhost:4000/api/jobPost/${jobId}`);
          if (!response.ok) throw new Error("Failed to fetch job details.");
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
      setError("Бүх талбарыг бөглөх шаардлагатай."); // "All fields are required."
      return;
    }
  
    if (role !== "freelancer") {
      setError("Зөвхөн фрилансерууд саналаа илгээх боломжтой."); // "Only freelancers can submit proposals."
      return;
    }
  
    setIsSubmitting(true);
    setError(null);
  
    const bidAmount = job.budget_type === "hourly" ? job.hourly_rate_to : job.project_max_budget;
  
    try {
      const response = await fetch(`http://localhost:4000/api/application`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          freelancer_id: userId,
          jobpost_id: job.id,
          job_title: job.title,
          proposal: proposalLetter,
          bid: bidAmount,
        }),
      });
  
      if (!response.ok) {
        if (response.status === 409) {
          // Handle 409 Conflict (Freelancer has already applied for this job)
          const data = await response.json();
          setError(data.message); // Display conflict message from backend
        } else {
          throw new Error("Санал илгээхэд алдаа гарлаа."); // "Failed to submit the application."
        }
        return;
      }
  
      setSuccessMessage("Санал амжилттай илгээгдлээ!"); // "Proposal submitted successfully!"
      setProposalLetter(""); // Reset the form
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Уучлаарай, урьдчилан таамаглаагүй алдаа гарлаа." // "An unexpected error occurred."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const calculateFees = (amount: number) => ({
    fee: (amount * 0.05).toFixed(2),
    net: (amount * 0.95).toFixed(2),
  });

  const renderBudgetCard = () => {
    if (!job) return null;

    const { fee, net } = calculateFees(
      job.budget_type === "hourly" ? job.hourly_rate_to || 0 : job.project_max_budget || 0
    );

    return (
      <div className="border p-6 rounded-lg shadow-md space-y-2">
        <h2 className="text-lg font-bold">Төсвийн мэдээлэл</h2>
        <p>
          <strong>Төлбөрийн төрөл:</strong> {job.budget_type === "hourly" ? "Цагаар" : "Төслөөр"}
        </p>
        <p>
          <strong>{job.budget_type === "hourly" ? "Цагийн хөлс:" : "Төслийн төсөв:"}</strong>{" "}
          {job.budget_type === "hourly" ? job.hourly_rate_to : job.project_max_budget}₮
        </p>
        <p>
          <strong>Системийн шимтгэл (5%):</strong> {fee}₮
        </p>
        <p>
          <strong>Цэвэр орлого:</strong> {net}₮
        </p>
      </div>
    );
  };

  return (
    <div>
      <Header />
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Анкет илгээх</h1>

      {loading ? (
        <p>Ажлын дэлгэрэнгүй мэдээллийг ачаалж байна...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {renderBudgetCard()}

          <form onSubmit={handleSubmit} className="border p-6 rounded-lg shadow-md bg-white space-y-6">
            {successMessage && <p className="text-green-500">{successMessage}</p>}
            <div>
              <label htmlFor="proposalLetter" className="block text-lg font-medium mb-2">
                Захидал
              </label>
              <textarea
                id="proposalLetter"
                value={proposalLetter}
                onChange={(e) => setProposalLetter(e.target.value)}
                placeholder="Анкетын захидлаа энд бичнэ үү!"
                rows={6}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className={`w-full px-4 py-2 rounded-md text-white ${
                isSubmitting ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Анкет илгээх"}
            </button>
          </form>
        </>
      )}
    </div>
    </div>
  );
};

export default ProposalPage;
