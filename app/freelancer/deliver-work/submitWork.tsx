import { useEffect, useState } from 'react';
import { useUser } from "../../context/UserContext";

interface Application {
  proposal: string;
  id: number;
  job_title: string;
  status: string;
  bid: number;
  fee: number;
  net_amount: number;
}

interface Submission {
  application_id: number;
  status: string;
}

const SubmissionForm = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useUser();
  const freelancerId = userId;

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [comments, setComments] = useState('');
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitMessageType, setSubmitMessageType] = useState<'success' | 'error' | null>(null);
  const [workSubmitted, setWorkSubmitted] = useState(false);

  // Fetch submissions data for freelancer
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/payment/freelancer?freelancerId=${freelancerId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch submissions: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        
        // Log the fetched data to ensure it's coming correctly
        console.log("Fetched submissions:", data);
        
        // Correctly set submission status
        const mappedSubmissions = data.map((submission: any) => ({
          application_id: submission.application_id,
          status: submission.submission_status,  // Use submission_status here
        }));
        
        setSubmissions(mappedSubmissions);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error fetching submissions");
      }
    };
    fetchSubmissions();
  }, [freelancerId]);
  

  // Fetch applications data for freelancer
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/application/status?userId=${userId}`);
        const data = await response.json();
        if (response.ok) {
          setApplications(data);
        } else {
          throw new Error(data.message || "Error fetching applications");
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Unknown error");
      }
    };
    fetchApplications();
  }, [userId]);

  // Open modal for submitting work
  const openModal = (application: Application) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
    const existingSubmission = submissions.find(sub => sub.application_id === application.id);
    if (existingSubmission && existingSubmission.status === 'submitted') {
      setWorkSubmitted(true);  // Disable further submission if already submitted
    } else {
      setWorkSubmitted(false);
    }
  };

  // Close modal and reset state
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
    setComments('');
    setSubmitMessage('');
    setWorkSubmitted(false);
  };

  // Handle work submission
  const handleSubmitWork = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedApplication) return;

    try {
      const response = await fetch('http://localhost:4000/api/payment/submit-work', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ applicationId: selectedApplication.id, comments }),
      });

      const data = await response.json();
      if (response.ok) {
        setSubmitMessageType('success');
        setSubmitMessage(data.message); // 'Материал амжилттай илгээгдлээ'
        setWorkSubmitted(true); // Mark work as submitted
      } else {
        setSubmitMessageType('error');
        setSubmitMessage(data.message || 'Материал илгээхэд алдаа гарлаа');
      }
    } catch (error) {
      setSubmitMessage('Материал илгээхэд алдаа гарлаа');
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'илгээгдсэн': // Sent
        return 'bg-green-50 text-green-700'; // Green for "Sent"
      case 'баталгаажсан': // Confirmed
        return 'bg-blue-50 text-blue-700'; // Blue for "Confirmed"
      case 'засвар_хүссэн': // Needs revision
        return 'bg-yellow-50 text-yellow-700'; // Yellow for "Needs revision"
      case 'хүлээгдэж байна': // Pending
      default:
        return 'bg-gray-50 text-gray-700'; // Gray for "Pending" or default
    }
  };

  // Format currency for display
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('mn-MN', {
      style: 'currency',
      currency: 'MNT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h2 className="text-xl font-bold">Илгээмжийн Форм</h2>
  
      {applications.map((application) => {
        // Find the submission corresponding to this application
        const submission = submissions.find((sub) => sub.application_id === application.id);
  
        return (
          <div
            key={application.id}
            className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
          >
            <div className="space-y-4">
              {/* Flex container to align submission status and job title */}
              <div className="flex justify-between items-center">
                <p className="text-lg font-medium text-gray-900">
                  Ажлын нэр: {application.job_title}
                </p>
  
                {/* Display submission status at the top-right corner with styles */}
                <div className={`text-sm font-semibold p-2 rounded ${getStatusStyle(submission?.status ?? 'хүлээгдэж байна')}`}>
                  <p>Төлөв: {submission?.status ?? 'хүлээгдэж байна'}</p>
                </div>
              </div>
  
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>Нийт төлбөр:</strong> {formatCurrency(application.bid)}</p>
                <p><strong>Платформын Хураамж (5%):</strong> {formatCurrency(application.fee)}</p>
                <p><strong>Та хүлээн авах:</strong> {formatCurrency(application.net_amount)}</p>
              </div>
  
              {/* Submit button */}
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => openModal(application)}
                  className="bg-blue-500 text-white p-2 rounded"
                  disabled={workSubmitted} // Disable button if work already submitted
                >
                  Илгээх
                </button>
              </div>
            </div>
          </div>
        );
      })}
  
      {/* Submission Modal */}
      {isModalOpen && selectedApplication && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-lg font-semibold mb-4">Материал Илгээх</h3>
            <p><strong>Ажлын нэр:</strong> {selectedApplication.job_title}</p>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full p-2 border rounded mt-4"
              placeholder="Тайлбар оруулна уу"
              required
              disabled={workSubmitted} // Disable textarea if work already submitted
            />
            <div className="flex justify-end space-x-4 mt-4">
              <button
                onClick={closeModal}
                className="bg-gray-500 text-white p-2 rounded"
              >
                Болих
              </button>
              <button
                onClick={handleSubmitWork}
                className="bg-blue-500 text-white p-2 rounded"
                disabled={workSubmitted} // Disable button if work already submitted
              >
                Илгээх
              </button>
            </div>
            {submitMessage && (
              <div
                className={`mt-2 p-2 rounded ${submitMessageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
              >
                {submitMessage}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionForm;
