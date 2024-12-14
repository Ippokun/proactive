"use client"

import React from "react";
import { useSearchParams } from "next/navigation";

const ProposalPage = () => {
  const searchParams = useSearchParams();
  const jobId = searchParams?.get("jobId");

  // Handle the case where jobId might not exist
  if (!jobId) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-semibold text-red-500">
          Job ID is missing in the URL!
        </h1>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold">Proposal for Job ID: {jobId}</h1>
      {/* Add your proposal form or related content here */}
    </div>
  );
};

export default ProposalPage;
