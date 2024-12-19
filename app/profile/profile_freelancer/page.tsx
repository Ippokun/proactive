"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import { useUser } from "../../context/UserContext"; 
import Header from "../../../components/header";
import Footer from "../../../components/footer";
import { AiFillEdit } from "react-icons/ai";
import ProfileAvatar from "../../../components/ProfileAvatar";

const Profile = () => {
  const { userId, username, lastname, email, roleInMongolian } = useUser(); 
  const [file, setFile] = useState<File | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [bio, setBio] = useState<string>("");
  const [isEditingBio, setIsEditingBio] = useState<boolean>(false);

// Handle file input change
const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  if (!userId) {
    alert('User ID not found. Please log in again.');
    return;
  }

  if (e.target.files && e.target.files[0]) {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    // Automatically trigger upload when file is selected
    const formData = new FormData();
    formData.append("profile_picture", selectedFile);
    formData.append("userId", userId.toString()); // Now TypeScript knows userId is not null

    // Log contents of FormData
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    handleUpload(formData);
  }
};

// Modified upload handler
const handleUpload = async (formData: FormData) => {
  try {
    const response = await fetch("http://localhost:4000/api/profile-picture", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
      setProfilePicture(data.user.profile_picture);
    } else {
      alert(data.error || "Failed to upload profile picture");
    }
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    alert("An error occurred while uploading the profile picture.");
  }
};


  // Toggle editing mode
  const toggleEditBio = () => {
    setIsEditingBio((prev) => !prev);
  };

  // Save bio changes
  const saveBio = async () => {
    if (userId) {
      try {
        const response = await fetch(`http://localhost:4000/api/user-bio`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, bio }),
        });

        const data = await response.json();
        if (response.ok) {
          setIsEditingBio(false); // Exit editing mode
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error updating bio:", error);
        alert("An error occurred while updating your bio.");
      }
    }
  };

  return (
    <div>
      <Header />

      {/* Main Content */}
      <div className="min-h-screen flex flex-col mt-9 mx-20">
        {/* Profile Card */}
        <div className="flex flex-row rounded-lg border border-gray-200 bg-white p-6 shadow-md">
          {/* Avatar Section */}
          <ProfileAvatar
            username={username}
            profilePicture={profilePicture}
            onFileChange={handleFileChange}
          />

          {/* Profile Info Section */}
          <div className="flex flex-col flex-grow px-6">
            <h2 className="text-lg font-semibold">{lastname} {username}</h2>
            <p className="text-sm text-gray-500">{roleInMongolian}</p>

            <div className="my-2 text-gray-500">
              {isEditingBio ? (
                <div>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                  <div className="mt-2 flex space-x-2">
                    <button
                      onClick={saveBio}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                      Хадгалах
                    </button>
                    <button
                      onClick={toggleEditBio}
                      className="px-4 py-2 bg-gray-300 text-black rounded-md"
                    >
                      Цуцлах
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center">
                  <span>{bio}</span>
                  <AiFillEdit
                    onClick={toggleEditBio}
                    className="ml-2 text-blue-500 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Skill Section */}
        <div className="mt-10 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
          <h3 className="text-xl font-bold">Чадвар:</h3>
          <p className="mt-4 text-gray-700">
            Fullstack Developer with experience in React, Node.js, and modern web technologies. Looking to collaborate on
            exciting projects.
          </p>
        </div>

        {/* Contact Information */}
        <div className="mt-10 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
          <h3 className="text-xl font-bold">Холбоо барих мэдээлэл</h3>
          <div className="mt-4 text-gray-700">
            <p>Email: {email}</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
