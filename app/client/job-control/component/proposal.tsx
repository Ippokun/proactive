"use client";

import React, { useState, useEffect } from 'react';

const Proposals = () => {
  const [proposals, setProposals] = useState<any[]>([]);

  useEffect(() => {
    const fetchProposals = async () => {
      const response = await fetch('http://localhost:4000/api/proposals');
      const data = await response.json();
      setProposals(data);
    };

    fetchProposals();
  }, []);

  return (
    <div className="proposals">
      {proposals.length > 0 ? (
        proposals.map((proposal) => (
          <div key={proposal.id} className="proposal">
            <h3>Proposal for Job: {proposal.jobTitle}</h3>
            <p><strong>Freelancer:</strong> {proposal.freelancerName}</p>
            <p><strong>Proposal Text:</strong> {proposal.proposalText}</p>
            <button>View Details</button>
          </div>
        ))
      ) : (
        <p>Хүлээн авсан санал байхгүй байна.</p>
      )}
    </div>
  );
};

export default Proposals;
