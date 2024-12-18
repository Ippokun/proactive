"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";

const Profile = () => {
  const { userId, role } = useUser(); // Assuming user is authenticated and userId is available
  const [file, setFile] = useState<File | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    // Fetch profile picture if available when the page loads
    const fetchProfilePicture = async () => {
      if (userId) {
        try {
          const response = await fetch(`http://localhost:4000/api/profile-picture/${userId}`);
          const data = await response.json();
          if (response.ok) {
            setProfilePicture(data.user.profile_picture);
          }
        } catch (error) {
          console.error('Error fetching profile picture:', error);
        }
      }
    };
    
    fetchProfilePicture();
  }, [userId]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (file && userId) {
      const formData = new FormData();
      formData.append('profile_picture', file);
      formData.append('userId', userId.toString()); // Convert userId to string before appending
  
      try {
        const response = await fetch('http://localhost:4000/api/profile-picture', {
          method: 'POST',
          body: formData,
        });
  
        const data = await response.json();
        if (response.ok) {
          setProfilePicture(data.user.profile_picture); // Update profile picture on the UI
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error('Error uploading profile picture:', error);
        alert('An error occurred while uploading the profile picture.');
      }
    }
  };
  

  return (
    <div className="mx-20 grid">
      {/* User Profile Tab Card */}
      <div className="flex flex-row rounded-lg border border-gray-200/80 bg-white p-6">
        {/* Avatar Container */}
        <div className="relative">
          {/* User Avatar */}
          {profilePicture ? (
            <img
              className="w-40 h-40 rounded-md object-cover"
              src={profilePicture}
              alt="User"
            />
          ) : (
            <div className="w-40 h-40 rounded-md bg-gray-300 flex items-center justify-center">
              <span className="text-xl text-white">No Image</span>
            </div>
          )}

          {/* Online Status Dot */}
          <div
            className="absolute -right-3 bottom-5 h-5 w-5 sm:top-2 rounded-full border-4 border-white bg-green-400 sm:invisible md:visible"
            title="User is online"
          ></div>
        </div>

        {/* Meta Body */}
        <div className="flex flex-col px-6">
          {/* Username Container */}
          <div className="flex h-8 flex-row">
            {/* Username */}
            <a href="https://github.com/EgoistDeveloper/" target="_blank" rel="noopener noreferrer">
              <h2 className="text-lg font-semibold">EgoistDeveloper</h2>
            </a>
          </div>

          {/* Meta Badges */}
          <div className="my-2 flex flex-row space-x-2">
            {/* Badge Role */}
            <div className="flex flex-row">
              <div className="text-xs text-gray-400/80 hover:text-gray-400">Fullstack Developer</div>
            </div>

            {/* Badge Location */}
            <div className="flex flex-row">
              <div className="text-xs text-gray-400/80 hover:text-gray-400">Istanbul</div>
            </div>

            {/* Badge Email */}
            <div className="flex flex-row">
              <div className="text-xs text-gray-400/80 hover:text-gray-400">email@example.com</div>
            </div>
          </div>

          {/* Bio */}
          <div className="my-3 text-gray-500">
            Passionate Fullstack Developer with a love for clean code and intuitive designs. Enjoys tackling challenging projects and collaborating with teams to create innovative solutions.
          </div>

          {/* Edit Profile Button */}
          <button className="mt-4 w-40 rounded-lg bg-blue-600 text-white py-2 px-4 hover:bg-blue-700 transition duration-200">
            Edit Profile
          </button>
        </div>
      </div>

      {/* Upload Section */}
      <div className="mt-10">
        <h3 className="text-xl font-bold">Upload New Profile Picture</h3>
        <div className="my-4 flex flex-col space-y-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="border border-gray-300 rounded-lg p-2"
          />
          <button
            onClick={handleUpload}
            className="w-40 rounded-lg bg-green-600 text-white py-2 px-4 hover:bg-green-700 transition duration-200"
          >
            Upload Profile Picture
          </button>
        </div>
      </div>

      {/* About User Section */}
      <div className="mt-10">
        <h3 className="text-xl font-bold">About</h3>
        <p className="mt-4 text-gray-700">
          Fullstack Developer with experience in building and deploying scalable web applications. Proficient in React, Node.js, and modern web technologies. Looking to collaborate on exciting projects that challenge my skills.
        </p>
      </div>

      {/* Contact Information Section */}
      <div className="mt-10">
        <h3 className="text-xl font-bold">Contact Information</h3>
        <div className="mt-4 text-gray-700">
          <p>Email: email@example.com</p>
          <p>Phone: (123) 456-7890</p>
          <p>Location: Istanbul, Turkey</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
