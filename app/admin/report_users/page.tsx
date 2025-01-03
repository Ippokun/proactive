"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const UserReport = () => {
  const [userReport, setUserReport] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [fetchDate, setFetchDate] = useState<string>("");

  const router = useRouter();

  const handleBackClick = () => {
    router.push('/admin'); // Navigate to the Admin page when clicked
  };

  useEffect(() => {
    fetch('http://localhost:4000/api/admin/report/users')
      .then((res) => res.json())
      .then((data) => {
        setUserReport(data);
        setFetchDate(new Date().toLocaleString()); // Set the fetch date when data is received
        setIsLoading(false);
      })
      .catch((error) => {
        setError("Өгөгдөл ачаалахад алдаа гарлаа");
        setIsLoading(false);
      });
  }, []);

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
        <h2 className="text-xl font-semibold text-gray-800">Хэрэглэгчийн тайлан</h2>
        <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium">
          Нийт: {userReport.totalUsers}
        </span>
      </div>

      {/* Show the date the report was fetched */}
      {fetchDate && (
        <div className="mb-4 text-sm text-gray-500">
          <strong>Тайлан хэвлэсэн огноо:</strong> {fetchDate}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Код</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Овог</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Нэр</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Имэйл</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Төрөл</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Огноо</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {userReport.users.length > 0 ? (
              userReport.users.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.last_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.first_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  Бүртгэлтэй хэрэглэгч байхгүй байна.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserReport;
