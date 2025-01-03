"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Modal from "../../../components/modal";
import { useUser } from "../../../app/context/UserContext";

interface JobPost {
  id: number;
  title: string;
  description: string;
  skills: string[];
  deadline: string;
  project_type: string;
  budget_type: string;
  created_at: string;
}

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [jobPosts, setJobPosts] = useState<JobPost[]>([]);
  const [totalJobPosts, setTotalJobPosts] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn, role } = useUser(); 
  const [ isModalOpen, setModalOpen] = useState(false);
  

  const pathname = usePathname(); // Get the current pathname
  const router = useRouter();
  
    const handleNavigateToUserReport = () => {
      router.push('/admin/report_jobposts');
    };

    const toggleModal = () => {
      setModalOpen((prev) => !prev); // Toggle the modal visibility
    };

  // src/api/adminDashboard.ts
  const fetchAdminDashboardData = async () => {
    try {
        const response = await fetch('http://localhost:4000/api/admin/dashboard');
        if (!response.ok) {
            throw new Error('Failed to fetch admin data');
        }
        const data = await response.json();

        console.log('Fetched data:', data);  // Check this log

        setJobPosts(data.jobPosts);
        setTotalJobPosts(data.totalJobPosts);
    } catch (err) {
        setError('Failed to load dashboard data');
        console.error('Error fetching dashboard data:', err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminDashboardData();
  }, []);

  useEffect(() => {
    console.log('Updated totalUsers:', totalJobPosts); // Log when state changes
  }, [totalJobPosts]);

  return (
    <div>
      <script src="https://cdn.jsdelivr.net/gh/alpinejs/alpine@v2.x.x/dist/alpine.min.js" defer></script>
      
      <div className="flex h-screen bg-gray-200">
        <div 
          onClick={() => setSidebarOpen(false)} 
          className={`fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
        ></div>

        <div className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-gray-900 lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'
        }`}>
          <div className="flex items-center justify-center mt-8">
            <div className="flex items-center">
              <svg className="w-12 h-12" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M364.61 390.213C304.625 450.196 207.37 450.196 147.386 390.213C117.394 360.22 102.398 320.911 102.398 281.6C102.398 242.291 117.394 202.981 147.386 172.989C147.386 230.4 153.6 281.6 230.4 307.2C230.4 256 256 102.4 294.4 76.7999C320 128 334.618 142.997 364.608 172.989C394.601 202.981 409.597 242.291 409.597 281.6C409.597 320.911 394.601 360.22 364.61 390.213Z" fill="#4C51BF" stroke="#4C51BF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                <path d="M201.694 387.105C231.686 417.098 280.312 417.098 310.305 387.105C325.301 372.109 332.8 352.456 332.8 332.8C332.8 313.144 325.301 293.491 310.305 278.495C295.309 263.498 288 256 275.2 230.4C256 243.2 243.201 320 243.201 345.6C201.694 345.6 179.2 332.8 179.2 332.8C179.2 352.456 186.698 372.109 201.694 387.105Z" fill="white"></path>
              </svg>
              
              <span className="mx-2 text-2xl font-semibold text-white">Хяналтын самбар</span>
            </div>
          </div>

          <nav className="mt-10">
            {/* Navigation Items */}
            <Link
                href="/admin"
                className={`flex items-center px-6 py-2 mt-4 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100 ${pathname === '/admin' ? 'bg-opacity-100 text-white' : ''}`}
            >
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path>
                </svg>
                <span className="mx-3">Бүртгэлтэй хэрэглэгч</span>
            </Link>

            <Link
                href="/admin/jobpost"
                className={`flex items-center px-6 py-2 mt-4 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100 ${pathname === '/admin/jobpost' ? 'bg-opacity-100 text-white' : ''}`}
            >
                <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z"></path>
                </svg>
                <span className="mx-3">Ажлын зар</span>
            </Link>
    
                {/* <a className="flex items-center px-6 py-2 mt-4 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100"
                    href="#">
                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10">
                        </path>
                    </svg>
    
                    <span className="mx-3">Tables</span>
                </a>
    
                <a className="flex items-center px-6 py-2 mt-4 text-gray-500 hover:bg-gray-700 hover:bg-opacity-25 hover:text-gray-100"
                    href="#">
                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z">
                        </path>
                    </svg>
    
                    <span className="mx-3">Forms</span>
                </a> */}

            {/* More navigation items */}
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between px-6 py-4 bg-white border-b-4 border-indigo-600">
            <div className="flex items-center">
              <button onClick={() => setSidebarOpen(true)} className="text-gray-500 focus:outline-none lg:hidden">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6H20M4 12H20M4 18H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </button>

              {/* Search bar */}
              <div className="relative mx-4 lg:mx-0">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none">
                    <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </span>
                <input className="w-32 pl-10 pr-4 rounded-md form-input sm:w-64 focus:border-indigo-600" type="text" placeholder="Хайх" />
              </div>
            </div>

            {/* User menu */}
            <div className="flex items-center">
              <div className="relative">
                <button onClick={() => setNotificationOpen(!notificationOpen)} className="flex mx-4 text-gray-600 focus:outline-none">
                  {/* Notification icon */}
                </button>
                
                {notificationOpen && (
                  <div className="absolute right-0 z-10 w-80 mt-2 overflow-hidden bg-white rounded-lg shadow-xl">
                    {/* Notification items */}
                  </div>
                )}
              </div>

              {/* User dropdown */}
              {/* If user is logged in, show a profile picture or avatar */}
               {isLoggedIn && (
                <div className="relative">
                  <img
                    src="/asset/avatar-boy.svg"
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-black cursor-pointer"
                    onClick={toggleModal}
                  />
                  {/* Modal component */}
                  <Modal
                    isOpen={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    profilePic="/asset/avatar-boy.svg"  // Pass profilePic here
                  />
                </div>
              )}
            </div>
          </header>

          {/* Main content area */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
            {/* Dashboard content */}
            <div className="container px-6 py-8 mx-auto">
              <h3 className="text-3xl font-medium text-gray-700">Хяналтын самбар</h3>
              
              {/* Stats cards */}
              <div className="mt-4">
                        <div className="flex flex-wrap -mx-6">
                            {/* <div className="w-full px-6 sm:w-1/2 xl:w-1/3">
                                <div className="flex items-center px-5 py-6 bg-white rounded-md shadow-sm">
                                    <div className="p-3 bg-indigo-600 bg-opacity-75 rounded-full">
                                        <svg className="w-8 h-8 text-white" viewBox="0 0 28 30" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M18.2 9.08889C18.2 11.5373 16.3196 13.5222 14 13.5222C11.6804 13.5222 9.79999 11.5373 9.79999 9.08889C9.79999 6.64043 11.6804 4.65556 14 4.65556C16.3196 4.65556 18.2 6.64043 18.2 9.08889Z"
                                                fill="currentColor"></path>
                                            <path
                                                d="M25.2 12.0444C25.2 13.6768 23.9464 15 22.4 15C20.8536 15 19.6 13.6768 19.6 12.0444C19.6 10.4121 20.8536 9.08889 22.4 9.08889C23.9464 9.08889 25.2 10.4121 25.2 12.0444Z"
                                                fill="currentColor"></path>
                                            <path
                                                d="M19.6 22.3889C19.6 19.1243 17.0927 16.4778 14 16.4778C10.9072 16.4778 8.39999 19.1243 8.39999 22.3889V26.8222H19.6V22.3889Z"
                                                fill="currentColor"></path>
                                            <path
                                                d="M8.39999 12.0444C8.39999 13.6768 7.14639 15 5.59999 15C4.05359 15 2.79999 13.6768 2.79999 12.0444C2.79999 10.4121 4.05359 9.08889 5.59999 9.08889C7.14639 9.08889 8.39999 10.4121 8.39999 12.0444Z"
                                                fill="currentColor"></path>
                                            <path
                                                d="M22.4 26.8222V22.3889C22.4 20.8312 22.0195 19.3671 21.351 18.0949C21.6863 18.0039 22.0378 17.9556 22.4 17.9556C24.7197 17.9556 26.6 19.9404 26.6 22.3889V26.8222H22.4Z"
                                                fill="currentColor"></path>
                                            <path
                                                d="M6.64896 18.0949C5.98058 19.3671 5.59999 20.8312 5.59999 22.3889V26.8222H1.39999V22.3889C1.39999 19.9404 3.2804 17.9556 5.59999 17.9556C5.96219 17.9556 6.31367 18.0039 6.64896 18.0949Z"
                                                fill="currentColor"></path>
                                        </svg>
                                    </div>
    
                                    <div className="mx-5">
                                        <h4 className="text-2xl font-semibold text-gray-700">{}</h4>
                                        <div className="text-gray-500">Бүртгэлтэй хэрэглэгч</div>
                                    </div>
                                </div>
                            </div> */}
    
                            <div className="w-full px-6 mt-6 sm:w-1/2 xl:w-1/3 sm:mt-0">
                                <div className="flex items-center px-5 py-6 bg-white rounded-md shadow-sm">
                                    <div className="p-3 bg-orange-600 bg-opacity-75 rounded-full">
                                    <svg 
                                      xmlns="http://www.w3.org/2000/svg" 
                                      className="text-white" 
                                      width="28" 
                                      height="28" 
                                      viewBox="0 0 48 48" 
                                      fill="none"
                                    >
                                        <path 
                                          fillRule="evenodd" 
                                          clipRule="evenodd" 
                                          d="M19.5 15.6857L19.5 4.5H4.5V18.75L5.25 19.5L13.7205 19.5V19.5H15.2205V19.5H15.6857L19.5 15.6857ZM15.2205 17.8439L17.8437 15.2206H15.2205V17.8439ZM18 13.7206L18 6L6 6L6 18L13.7205 18V13.7206H18Z" 
                                          fill="#ffffff" 
                                          transform="scale(2)" 
                                        />
                                    </svg>
                                    </div>
    
                                    <div className="mx-5">
                                        <h4 className="text-2xl font-semibold text-gray-700">{totalJobPosts}</h4>
                                        <div className="text-gray-500">Нийт ажлын зар</div>
                                    </div>
                                </div>
                            </div>
    
                            {/* <div className="w-full px-6 mt-6 sm:w-1/2 xl:w-1/3 xl:mt-0">
                                <div className="flex items-center px-5 py-6 bg-white rounded-md shadow-sm">
                                    <div className="p-3 bg-pink-600 bg-opacity-75 rounded-full">
                                        <svg className="w-8 h-8 text-white" viewBox="0 0 28 28" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <path d="M6.99998 11.2H21L22.4 23.8H5.59998L6.99998 11.2Z" fill="currentColor"
                                                stroke="currentColor" strokeWidth="2" stroke-linejoin="round"></path>
                                            <path
                                                d="M9.79999 8.4C9.79999 6.08041 11.6804 4.2 14 4.2C16.3196 4.2 18.2 6.08041 18.2 8.4V12.6C18.2 14.9197 16.3196 16.8 14 16.8C11.6804 16.8 9.79999 14.9197 9.79999 12.6V8.4Z"
                                                stroke="currentColor" strokeWidth="2"></path>
                                        </svg>
                                    </div>
    
                                    <div className="mx-5">
                                        <h4 className="text-2xl font-semibold text-gray-700">215,542</h4>
                                        <div className="text-gray-500">Available Products</div>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>

              {/* User table */}
              <div className="flex flex-col mt-8">
                <div className="py-2 -my-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                  <div className="inline-block min-w-full overflow-hidden align-middle border-b border-gray-200 shadow sm:rounded-lg">
                    <table className="min-w-full">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">Ажлын гарчиг</th>
                          <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">Ажлын төрөл</th>
                          <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">Төсвийн төрөл</th>
                          <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">Ажлын хугацаа</th>
                          <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left text-gray-500 uppercase border-b border-gray-200 bg-gray-50">
                          {/* Button placed in the last column header */}
                          <div className="flex justify-end">
                            <button
                              onClick={handleNavigateToUserReport}
                              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
                            >
                              Хэвлэх
                            </button>
                          </div>
                        </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white">
                        {jobPosts.map((jobPost, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 w-10 h-10">
                                  <img className="w-10 h-10 rounded-full"  alt="" />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium leading-5 text-gray-900">{jobPost.title}</div>
                                  {/* <div className="text-sm leading-5 text-gray-500">{user.email}</div> */}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                              <div className="text-sm leading-5 text-gray-900">{jobPost.project_type}</div>
                              {/* <div className="text-sm leading-5 text-gray-500">{user.email}</div> */}
                            </td>
                            <td className="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                              <span className="inline-flex px-2 text-xs font-semibold leading-5 text-green-800 bg-green-100 rounded-full">
                                {jobPost.budget_type}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm leading-5 text-gray-500 whitespace-no-wrap border-b border-gray-200">
                              {jobPost.deadline}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium leading-5 text-right whitespace-no-wrap border-b border-gray-200">
                            <a href="#" className="text-red-600 hover:text-red-900">Устгах</a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </main> 
        </div>
      </div>
    </div>
  );
};

export default Dashboard;