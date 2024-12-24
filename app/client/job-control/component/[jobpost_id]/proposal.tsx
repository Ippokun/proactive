"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "../../../../context/UserContext";

const Proposals = () => {
  const [proposals, setProposals] = useState<any[]>([]);
  const [showEscrowModal, setShowEscrowModal] = useState(false); // State for modal visibility
  const [selectedProposal, setSelectedProposal] = useState<any>(null); // Track the selected proposal for payment
  const [isChecked, setIsChecked] = useState(false); // State to track checkbox status
  const { userId } = useUser(); // Access the logged-in user's ID (client_id)
  const clientId = userId;
  console.log("client_id", clientId);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await fetch(
          `http://localhost:4000/api/application/client/${clientId}`
        );
        const data = await response.json();
        setProposals(data); // Set the fetched proposals
      } catch (error) {
        console.error("Error fetching proposals:", error);
      }
    };

    fetchProposals();
  }, [clientId]); // Re-fetch proposals if clientId changes

  const handleOpenEscrowModal = (proposal: any) => {
    console.log("Selected Proposal:", proposal); // Log the selected proposal
    setSelectedProposal(proposal); // Set the selected proposal for payment
    setShowEscrowModal(true); // Show the payment modal
  };

  const handleMoveToEscrow = async () => {
    if (!selectedProposal || !isChecked) return; // Ensure checkbox is checked before proceeding

    try {
      const response = await fetch(`http://localhost:4000/api/payment/escrow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          application_id: selectedProposal.application_id,
          client_id: clientId,
          freelancer_id: selectedProposal.freelancer_id,
          amount: selectedProposal.bid,
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        console.log("Payment moved to escrow", data.message);
        await handleAcceptProposal(selectedProposal.application_id);
        setShowEscrowModal(false); // Close the modal
      } else {
        console.error("Failed to move payment to escrow:", data.message);
      }
    } catch (error) {
      console.error("Error moving payment to escrow:", error);
    }
  };

  const handleAcceptProposal = async (applicationId: string) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/application/accept/${applicationId}`,
        {
          method: "PATCH", // You might use PATCH or PUT to update the application status
        }
      );
      const data = await response.json();
      if (data.success) {
        setProposals((prevProposals) =>
          prevProposals.map((proposal) =>
            proposal.application_id === applicationId
              ? { ...proposal, status: "accepted" }
              : proposal
          )
        );
      } else {
        console.error("Failed to accept proposal");
      }
    } catch (error) {
      console.error("Error accepting proposal:", error);
    }
  };

  const handleRejectedProposal = async (applicationId: string) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/application/rejected/${applicationId}`,
        {
          method: "PATCH", // Decline application via a PATCH request
        }
      );
      const data = await response.json();
      if (data.success) {
        setProposals((prevProposals) =>
          prevProposals.map((proposal) =>
            proposal.application_id === applicationId
              ? { ...proposal, status: "rejected" }
              : proposal
          )
        );
      } else {
        console.error("Failed to decline proposal");
      }
    } catch (error) {
      console.error("Error declining proposal:", error);
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsChecked(e.target.checked);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Ажлын анкет</h1>
      {proposals.length > 0 ? (
        proposals.map((proposal) => (
          <div
            key={proposal.application_id}
            className="bg-white p-4 rounded shadow mb-4 border"
          >
            <h3 className="text-xl font-semibold text-blue-600 mb-2">
              Ажлын хүсэлт: {proposal.job_title}
            </h3>
            <p className="text-sm text-gray-700">
              <strong>Фрилансер:</strong> {proposal.freelancer_name}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Өргөдөл:</strong> {proposal.proposal}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Нийт төсөв:</strong> {proposal.bid}₮
            </p>
            {proposal.status === "pending" && (
              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => handleOpenEscrowModal(proposal)}
                  className="bg-green-500 text-white py-2 px-4 rounded"
                >
                  Хүлээн авах
                </button>
                <button
                  onClick={() =>
                    handleRejectedProposal(proposal.application_id)
                  }
                  className="bg-red-500 text-white py-2 px-4 rounded"
                >
                  Татгалзах
                </button>
              </div>
            )}
            {proposal.status === "accepted" && (
              <p className="text-green-500 font-semibold">
                Өргөдөл хүлээн авсан
              </p>
            )}
            {proposal.status === "rejected" && (
              <p className="text-red-500 font-semibold">Өргөдөл татгалзсан</p>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">Ажлын хүсэлт хүлээж аваагүй байна.</p>
      )}

      {/* Escrow Payment Modal */}
      {showEscrowModal && selectedProposal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-xl font-bold mb-4">Итгэмжлэгдсэн дансанд Төлбөр Шилжүүлэх</h2>
            
            {/* Job Details */}
            <div className="mb-4">
              <p>
                <strong>Ажлын нэр:</strong> {selectedProposal.job_title}
              </p>
              <p>
                <strong>Фрилансер:</strong> {selectedProposal.freelancer_name}
              </p>
            </div>
            
            {/* Payment Breakdown */}
            <div className="border-t border-b py-4 mb-4">
              <p className="flex justify-between">
                <span>Төлбөрийн хэмжээ:</span> 
                <span>{selectedProposal.bid}₮</span>
              </p>
              <p className="flex justify-between font-bold">
                <span>Нийт:</span>
                <span>{selectedProposal.bid}₮</span>
              </p>
            </div>
            
            {/* Escrow Explanation */}
            <div className="text-sm text-gray-600 mb-4">
              <p>
                Итгэмжлэгдсэн данс нь таны төлбөрийг аюулгүй байлгаж, 
                ажил дууссаны дараа л фрилансерт шилжүүлнэ. Энэ нь 
                талуудын хооронд итгэлцэл бий болгоход тусалдаг.
              </p>
            </div>
            
            {/* Confirmation Checkbox */}
            <div className="mb-4">
              <label className="flex items-center text-sm">
                <input 
                  type="checkbox" 
                  className="mr-2" 
                  required 
                  checked={isChecked}
                  onChange={handleCheckboxChange} // Handle checkbox change
                />
                Би Төлбөрийн нөхцлийг ойлгосон.
              </label>
            </div>
            
            {/* Action Buttons */}
            <div className="flex justify-between gap-4">
              <button
                onClick={handleMoveToEscrow}
                className={`py-2 px-4 rounded ${!isChecked ? 'bg-green-500 text-gray-300 cursor-not-allowed' : 'bg-green-500 text-white'}`} 
                disabled={!isChecked} // Disable if checkbox is not checked
              >
                Төлбөр шилжүүлэх
              </button>
              <button
                onClick={() => setShowEscrowModal(false)}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Цуцлах
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Proposals;
