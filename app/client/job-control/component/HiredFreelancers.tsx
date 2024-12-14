import React, { useState, useEffect } from 'react';

const HiredFreelancers = () => {
  const [hiredFreelancers, setHiredFreelancers] = useState<any[]>([]);

  useEffect(() => {
    const fetchHiredFreelancers = async () => {
      const response = await fetch('http://localhost:4000/api/hiredFreelancers');
      const data = await response.json();
      setHiredFreelancers(data);
    };

    fetchHiredFreelancers();
  }, []);

  return (
    <div className="hired-freelancers">
      {hiredFreelancers.length > 0 ? (
        hiredFreelancers.map((freelancer) => (
          <div key={freelancer.id} className="hired-freelancer">
            <h3>{freelancer.name}</h3>
            <p><strong>Job:</strong> {freelancer.jobTitle}</p>
            <p><strong>Status:</strong> {freelancer.status}</p>
          </div>
        ))
      ) : (
        <p>Хөлсөлсөн фрилансер байхгүй байна.</p>
      )}
    </div>
  );
};

export default HiredFreelancers;
