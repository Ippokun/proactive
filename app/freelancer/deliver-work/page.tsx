"use client";

import Header from "../../../components/header";
import Footer from "../../../components/footer";
import React, { useState, useEffect } from 'react';
import ViewApplications from './ViewApplications'; 
import PaymentStatus from './PaymentStatus'; 
import SubmitWork from './submitWork'; 
import Link from "next/link";

export default function FreelancerDashboard() {
  const [activeTab, setActiveTab] = useState('applications'); // Default tab to 'applications'
  const [selectedJob, setSelectedJob] = useState(null); // Track selected job if needed

  return (
    <div className="bg-gradient-to-b from-white-50 to-green-100">
      <Header />
      <div className="mt-7 min-h-screen freelancer-dashboard">
        {/* Tab navigation section */}
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-1" style={{ marginRight: '19.75rem', marginLeft: '19.75rem' }}>
          <ul className="flex items-center gap-2 text-sm font-medium">
            <li className="flex-1">
              <button
                onClick={() => setActiveTab('applications')}
                className={`w-full text-center flex items-center justify-center gap-2 rounded-lg px-3 py-2 shadow text-xl font-bold ${
                  activeTab === 'applications' ? 'bg-white text-gray-700' : 'text-gray-500 hover:bg-white hover:text-gray-700'
                }`}
              >
               Хүсэлтийн төлөв
              </button>
            </li>
            <li className="flex-1">
              <button
                onClick={() => setActiveTab('paymentStatus')}
                className={`w-full text-center flex items-center justify-center gap-2 rounded-lg px-3 py-2 shadow text-xl font-bold ${
                  activeTab === 'paymentStatus' ? 'bg-white text-gray-700' : 'text-gray-500 hover:bg-white hover:text-gray-700'
                }`}
              >
                Төлбөрийн төлөв
              </button>
            </li>
            <li className="flex-1">
              <button
                onClick={() => setActiveTab('submitWork')}
                className={`w-full text-center flex items-center justify-center gap-2 rounded-lg px-3 py-2 shadow text-xl font-bold ${
                  activeTab === 'submitWork' ? 'bg-white text-gray-700' : 'text-gray-500 hover:bg-white hover:text-gray-700'
                }`}
              >
                Ажил хүлээлгэх
              </button>
            </li>
          </ul>
        </div>

        {/* Content display based on active tab */}
        <div className="content mt-4">
          {activeTab === 'applications' && <ViewApplications />} {/* View the status of submitted proposals */}
          {activeTab === 'paymentStatus' && <PaymentStatus />} {/* View active contracts */}
          {activeTab === 'submitWork' && <SubmitWork />} {/* Submit Work */}
        </div>
      </div>
      <Footer />
    </div>
  )
}
