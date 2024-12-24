import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";

interface Application {
  proposal: string;
  id: number;
  job_title: string;
  status: string;
  bid: number;
  fee: number;
  net_amount: number;
  // for other like should i add a array.
}

interface TruncatedProposalProps {
  text: string;
  maxLines?: number; // Optional prop
}

const TruncatedProposal: React.FC<TruncatedProposalProps> = ({ text, maxLines = 4 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-2">
      <div className="bg-gray-50 p-3 rounded">  
        <p className="text-gray-600">Захидал:</p>
        <div className={`relative ${!isExpanded ? "max-h-24 overflow-hidden" : ""}`}>
          <p className="text-gray-800 whitespace-pre-wrap">{text}</p>
          {!isExpanded && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-50 to-transparent" />
          )}
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {isExpanded ? "Хураангуй" : "Дэлгэрэнгүй"}
        </button>
      </div>
    </div>
  );
};

const ViewApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useUser();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/application/status?userId=${userId}`);
        console.log("aaaaa userId", userId);
        
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

  const handleWithdraw = async (applicationId: number) => {
    try {
      console.log("Withdrawing application:", applicationId);
      
      const response = await fetch(`http://localhost:4000/api/application/withdraw/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Error withdrawing application");
      }
      
      // Update the application status in the UI instead of removing it
      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application.id === applicationId
            ? { ...application, status: 'withdrawn' }
            : application
        )
      );
      
      console.log("Application withdrawn successfully");
      
      // Optionally show a success message to the user
      setError(null); // Clear any existing errors
      // If you have a success message state:
      // setSuccessMessage("Application withdrawn successfully");
      
    } catch (error) {
      console.error("Error withdrawing application:", error);
      setError(error instanceof Error ? error.message : "Failed to withdraw application");
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-50 text-green-700';
      case 'rejected':
        return 'bg-red-50 text-red-700';
      case 'withdrawn':
        return 'bg-gray-50 text-gray-700';
      default:
        return 'bg-yellow-50 text-yellow-700';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('mn-MN', {
      style: 'currency',
      currency: 'MNT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
  <h1 className="text-3xl font-bold mb-6 text-gray-800">Таны илгээсэн анкет</h1>
  
  {error && (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
      <p className="text-red-600">{error}</p>
    </div>
  )}

  <div className="space-y-4">
    {applications.map((application) => (
      <div
        key={application.id}
        className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-200"
      >
        <div className="space-y-4">
          {/* Job Title and Status */}
          <div className="flex justify-between items-start">
            <p className="text-lg font-medium text-gray-900">
              Ажлын нэр: {application.job_title}
            </p>
            <span className={`px-3 py-1 text-sm rounded-full ${getStatusStyle(application.status)}`}>
              {application.status === 'pending' ? 'Хүлээгдэж байна' :
               application.status === 'accepted' ? 'Хүлээн авсан' :
               application.status === 'withdrawn' ? 'Татсан' : 'Татгалзсан'}
            </span>
          </div>

          {/* Proposal */}
          <TruncatedProposal text={application.proposal} />

          {/* Bid, Fee, and Net Amount */}
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>Нийт төлбөр:</strong> {formatCurrency(application.bid)}</p>
            <p><strong>Платформын Хураамж (5%):</strong> {formatCurrency(application.fee)}</p>
            <p><strong>Та хүлээн авах:</strong> {formatCurrency(application.net_amount)}</p>
          </div>

          {/* Withdraw Button */}
          {application.status === 'pending' && (
            <div className="mt-4">
              <button
                onClick={() => handleWithdraw(application.id)}
                className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded transition-colors duration-200"
              >
                Анкетыг татах
              </button>
            </div>
          )}
        </div>
      </div>
    ))}
  </div>
</div>
  );
};  

export default ViewApplications;
