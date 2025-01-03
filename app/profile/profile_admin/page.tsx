"use client";

import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext"; 
import { AiFillEdit } from "react-icons/ai";

const Profile = () => {
  const { userId, username, lastname, email, roleInMongolian } = useUser(); 
  const [file, setFile] = useState<File | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [bio, setBio] = useState<string>("");
  const [isEditingBio, setIsEditingBio] = useState<boolean>(false);

  // Fetch the profile picture when the component mounts
  useEffect(() => {
    const fetchProfilePicture = async () => {
      if (userId) {
        try {
          const response = await fetch(`http://localhost:4000/api/profile-picture/${userId}`);
          
          // Log the response text for debugging
          const text = await response.text();
          console.log(text); // This will help you understand what is returned.
  
          if (response.ok) {
            const data = JSON.parse(text); // Manually parse if needed
            setProfilePicture(data.user.profile_picture);
          } else {
            console.error("Failed to fetch profile picture. Status:", response.status);
          }
        } catch (error) {
          console.error("Error fetching profile picture:", error);
        }
      }
    };
    
    fetchProfilePicture();
  }, [userId]);
  

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  // Upload profile picture
  const handleUpload = async () => {
    if (file && userId) {
      const formData = new FormData();
      formData.append("profile_picture", file);
      formData.append("userId", userId.toString());

      try {
        const response = await fetch("http://localhost:4000/api/profile-picture", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        if (response.ok) {
          setProfilePicture(data.user.profile_picture); // Update UI with new profile picture
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        alert("An error occurred while uploading the profile picture.");
      }
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
      {/* <Header /> */}

      {/* Main Content */}
      <div className="min-h-screen flex flex-col mt-9 mx-20">
        {/* Profile Card */}
        <div className="flex flex-row rounded-lg border border-gray-200 bg-white p-6 shadow-md">
          {/* Avatar Section */}
          <div className="relative w-40 h-40">
            {profilePicture ? (
              <img
                className="w-full h-full rounded-md object-cover"
                src={profilePicture}
                alt={`${username}'s Profile`}
              />
            ) : (
              <div className="w-full h-full rounded-md bg-gray-300 flex items-center justify-center">
                <span className="text-xl text-white">No Image</span>
              </div>
            )}
            <div
              className="absolute -right-3 bottom-5 h-5 w-5 rounded-full border-4 border-white bg-green-400"
              title="User is online"
            ></div>
          </div>

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

      {/* <Footer /> */}
    </div>
  );
};

export default Profile;
