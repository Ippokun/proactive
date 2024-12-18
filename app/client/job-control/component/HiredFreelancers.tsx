import React, { useState, useEffect } from 'react';
import { useUser } from "../../../context/UserContext";
import { FiMessageCircle } from 'react-icons/fi'; // Chat Icon from react-icons

const HiredFreelancers = () => {
  const [hiredFreelancers, setHiredFreelancers] = useState<any[]>([]);
  const { userId } = useUser();

  useEffect(() => {
    const fetchHiredFreelancers = async () => {
      const clientId = userId;
      const response = await fetch(`http://localhost:4000/api/hired/Freelancers?clientId=${clientId}`);
      const data = await response.json();
      setHiredFreelancers(data);
    };

    fetchHiredFreelancers();
  }, [userId]);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Хөлсөлсөн Фрилансерууд</h1>
      {hiredFreelancers.length > 0 ? (
        hiredFreelancers.map((freelancer) => (
          <div
            key={freelancer.freelancer_id}
            className="bg-white p-4 rounded shadow mb-4 border hover:shadow-lg transition-all"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-blue-600 mb-2">
                  {freelancer.freelancer_name}
                </h3>
                <p className="text-sm text-gray-700">
                  <strong>Ажлын нэр:</strong> {freelancer.job_title}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Төлбөрийн байдал:</strong> {freelancer.payment_status}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Хөлсөлсөн хугацаа:</strong> {freelancer.hired_time}
                </p>
              </div>
              <button
                onClick={() => alert("Open Chat with Freelancer")}
                className="text-blue-500 hover:text-blue-700"
              >
                <FiMessageCircle size={24} />
              </button>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-700">
                <strong>Үнэлгээ:</strong> {freelancer.rating}⭐
              </p>
              <p className="text-sm text-gray-700">
                {/* <strong>Үндсэн ур чадвар:</strong> {freelancer.skills.join(", ")} */}
              </p>
              <div className="mt-2">
                <button
                  onClick={() => alert("View Freelancer's Profile")}
                  className="bg-blue-500 text-white py-2 px-4 rounded"
                >
                  Үндсэн Профайл харах
                </button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Хөлсөлсөн фрилансер байхгүй байна.</p>
      )}
    </div>
  );
};

export default HiredFreelancers;
