"use client";

import Header from "../../../components/header";
import Footer from "../../../components/footer";
import React, { useState, useEffect } from 'react';
import ViewJobPosts from './component/viewJobPost';
import Proposals from './component/[jobpost_id]/proposal';
import HiredFreelancers from './component/HiredFreelancers';
import JobDescription from "./description/jobDescriptionModal";
import Link from "next/link";

export default function Jobcontrol() {
  const [activeTab, setActiveTab] = useState('jobPosts');
  const [selectedJob, setSelectedJob] = useState(null); // Track selected job

    return (
      <div className="bg-gradient-to-b from-white-50 to-green-100">
        <Header />
        <div className="client-dashboard">
          {/* Tab navigation section */}
          <div className="mt-7 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 p-1" style={{ marginRight: '19.75rem', marginLeft: '19.75rem' }}>
            <ul className="flex items-center gap-2 text-sm font-medium">
              <li className="flex-1">
                <button
                  onClick={() => setActiveTab('jobPosts')}
                  className={`w-full text-center flex items-center justify-center gap-2 rounded-lg px-3 py-2 shadow text-xl font-bold ${
                    activeTab === 'jobPosts' ? 'bg-white text-gray-700' : 'text-gray-500 hover:bg-white hover:text-gray-700'
                  }`}
                >
                  Нийтэлсэн ажил
                </button>
              </li>
              <li className="flex-1">
                <button
                  onClick={() => setActiveTab('proposals')}
                  className={`w-full text-center flex items-center justify-center gap-2 rounded-lg px-3 py-2 shadow text-xl font-bold ${
                    activeTab === 'proposals' ? 'bg-white text-gray-700' : 'text-gray-500 hover:bg-white hover:text-gray-700'
                  }`}
                >
                  Ирсэн санал
                </button>
              </li>
              <li className="flex-1">
                <button
                  onClick={() => setActiveTab('hiredFreelancers')}
                  className={`w-full text-center flex items-center justify-center gap-2 rounded-lg px-3 py-2 shadow text-xl font-bold ${
                    activeTab === 'hiredFreelancers' ? 'bg-white text-gray-700' : 'text-gray-500 hover:bg-white hover:text-gray-700'
                  }`}
                >
                  Хөлсөлсөн фрилансер
                </button>
              </li>
            </ul>
          </div>

          {/* Content display based on active tab */}
          <div className="content mt-4">
            {activeTab === 'jobPosts' && <ViewJobPosts />}
            {activeTab === 'proposals' && <Proposals />}
            {activeTab === 'hiredFreelancers' && <HiredFreelancers />}
          </div>
        </div>
        <Footer />
      </div>
      
    )
  }