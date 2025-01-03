"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const JobPostReport = () => {
  const [jobPostReport, setJobPostReport] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [fetchDate, setFetchDate] = useState<string>("");

  const router = useRouter();

  const handleBackClick = () => {
    router.push('/admin/jobpost'); // Navigate to the Admin page when clicked
  };

  useEffect(() => {
    fetch('http://localhost:4000/api/admin/report/jobposts')
      .then((res) => res.json())
      .then((data) => {
        setJobPostReport(data);
        setFetchDate(new Date().toLocaleString()); // Save the fetch time
        setIsLoading(false);
      })
      .catch((error) => {
        setError("Өгөгдөл ачаалахад алдаа гарлаа");
        setIsLoading(false);
      });
  }, []);

  const renderSkills = (skills: any) => {
    if (typeof skills === 'string') {
      return skills.split(',').map((skill: string, index: number) => (
        <span key={index} className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-600">
          {skill.trim()}
        </span>
      ));
    }
    if (Array.isArray(skills)) {
      return skills.map((skill: string, index: number) => (
        <span key={index} className="px-2 py-1 text-xs rounded bg-gray-100 text-gray-600">
          {skill}
        </span>
      ));
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg text-red-600 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
      <button
          onClick={handleBackClick} // Attach the back button click handler
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
        >
          Буцах
        </button>
        <h2 className="text-xl font-semibold text-gray-800">Ажлын зар</h2>
        <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium">
          Нийт: {jobPostReport.totalJobPosts}
        </span>
      </div>

      <div className="mb-4 text-sm text-gray-500">
        <span>Тайлан хэвлэсэн огноо: {fetchDate}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Код</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Гарчиг</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Тайлбар</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ур чадвар</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Хугацаа</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Төрөл</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Төсөв</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Огноо</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {jobPostReport.jobPosts.length > 0 ? (
              jobPostReport.jobPosts.map((jobPost: any) => (
                <tr key={jobPost.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{jobPost.id}</td>
                  <td className="px-4 py-4 text-sm text-gray-900 font-medium">{jobPost.title}</td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    <div className="max-w-xs overflow-hidden text-ellipsis">
                      {jobPost.description}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {renderSkills(jobPost.skills)}
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(jobPost.deadline).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 font-medium">
                      {jobPost.project_type}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-medium">
                      {jobPost.budget_type}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(jobPost.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-4 text-center text-sm text-gray-500">
                  Бүртгэлтэй ажлын зар байхгүй байна
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JobPostReport;
