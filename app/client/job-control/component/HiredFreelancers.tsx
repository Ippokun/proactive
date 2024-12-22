import React, { useState, useEffect } from 'react';
import { useUser } from "../../../context/UserContext";
import { FiMessageCircle } from 'react-icons/fi'; // Chat Icon from react-icons

const HiredFreelancers = () => {
  const [hiredFreelancers, setHiredFreelancers] = useState<any[]>([]); // State for hired freelancers
  const [submissions, setSubmissions] = useState<any[]>([]); // State for submissions
  const [loading, setLoading] = useState(true); // Loading state for freelancers
  const [loadingSubmissions, setLoadingSubmissions] = useState(true); // Loading state for submissions
  const { userId } = useUser(); // Assuming userId is the logged-in client's ID

  // Fetch hired freelancers
  useEffect(() => {
    const fetchHiredFreelancers = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/contract/Freelancers?clientId=${userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch hired freelancers.");
        const data = await response.json();
        setHiredFreelancers(data);
      } catch (error) {
        console.error("Error fetching freelancers:", error);
        alert("Фрилансеруудыг авах явцад алдаа гарлаа.");
      } finally {
        setLoading(false);
      }
    };

    fetchHiredFreelancers();
  }, [userId]);

  // Fetch submissions status for the client
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/payment/client?clientId=${userId}`
        );
        if (!response.ok) throw new Error("Failed to fetch submissions.");
        const data = await response.json();
        setSubmissions(data);
      } catch (error) {
        console.error("Error fetching submissions:", error);
        alert("Илгээмжийг авах явцад алдаа гарлаа.");
      } finally {
        setLoadingSubmissions(false);
      }
    };

    fetchSubmissions();
  }, [userId]);

  // Handle job approval and payment release
  const handleApproveJobAndReleasePayment = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/payment/approve", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          clientId: userId, // Send only the clientId
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message); // Success message
      } else {
        alert(`Error: ${data.error || "Something went wrong."}`);
      }
    } catch (error) {
      console.error("Error approving job:", error);
      alert("Фрилансеруудын мэдээллийг баталгаажуулах явцад алдаа гарлаа.");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Хөлсөлсөн Фрилансерууд</h1>
      {loading ? (
        <p className="text-gray-500">Ачааллаж байна...</p>
      ) : hiredFreelancers.length > 0 ? (
        hiredFreelancers.map((freelancer) => (
          <div
            key={`${freelancer.freelancer_id}-${freelancer.job_title}`} // Ensures unique key by combining freelancer_id and job_title
            className="bg-white p-4 rounded shadow mb-4 border hover:shadow-lg transition-all flex flex-col md:flex-row"
          >
            <div className="flex-grow">
              <h3 className="text-xl font-semibold text-blue-600 mb-2">
                {freelancer.freelancer_name}
              </h3>
              <p className="text-sm text-gray-700">
                <strong>Ажлын нэр:</strong> {freelancer.job_title}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Төлбөрийн байдал:</strong> {freelancer.payment_status}
              </p>
            </div>

            <div className="mt-4 md:mt-0 flex flex-col items-start space-y-2 md:items-end md:space-y-0">
              <button
                onClick={() => alert("Open Chat with Freelancer")}
                className="text-blue-500 hover:text-blue-700 mb-auto"
              >
                <FiMessageCircle size={24} />
              </button>
              <button
                onClick={handleApproveJobAndReleasePayment}
                className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
              >
                Төлбөр баталгаажуулах
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Хөлсөлсөн фрилансер байхгүй байна.</p>
      )}

      {/* Submissions Section */}
      <h2 className="text-2xl font-bold mt-10 mb-4">Илгээсэн Ажлууд</h2>
      {loadingSubmissions ? (
        <p className="text-gray-500">Илгээмжийг ачааллаж байна...</p>
      ) : submissions.length > 0 ? (
        submissions.map((submission) => (
          <div
            key={`${submission.submission_id}-${submission.application_id}`} // Use a combination of submission_id and application_id for unique key
            className="bg-white p-4 rounded shadow mb-4 border hover:shadow-lg transition-all"
          >
            <h3 className="text-xl font-semibold text-blue-600 mb-2">
              {submission.freelancer_name}
            </h3>
            <p className="text-sm text-gray-700">
              <strong>Ажлын нэр:</strong> {submission.job_title}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Тайлбар:</strong> {submission.submission_comments}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Төлөв:</strong> {submission.submission_status}
            </p>
            <p className="text-sm text-gray-500">
              <strong>Огноо:</strong> {new Date(submission.submission_created_at).toLocaleDateString()}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Илгээсэн ажил байхгүй байна.</p>
      )}
    </div>
  );
};

export default HiredFreelancers;
