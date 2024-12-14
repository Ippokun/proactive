"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "../app/context/UserContext";

export default function Modal({ isOpen, onClose, userName, userRole, profilePic }) {
  const { setUser } = useUser();
  const router = useRouter(); // Initialize the router

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // Reset user context state
    setUser({ isLoggedIn: false, role: "" });

    // Redirect to the login screen
    router.push("/login");

    // Optionally, close the modal (though the user will navigate away)
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 bg-white border rounded-lg shadow-lg w-64 z-50">
      <div className="p-4">
        <div className="flex items-center space-x-4">
          <img
            src={profilePic || "/asset/avatar-boy.svg"} // Fallback image
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
          <div>
            <p className="font-semibold">{userName}</p>
            <p className="text-sm text-gray-500">{userRole}</p>
          </div>
        </div>

        <div className="mt-4">
          <Link href="/profile">
            <p className="block text-blue-600 hover:underline cursor-pointer">
              Your Profile
            </p>
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-red-600 hover:underline mt-2"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

// Delete Confirmation Modal
export function ModalDelete({ isOpen, onClose, onConfirm, userName,
  userRole,
  profilePic, }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <p className="text-lg font-semibold mb-4">
          Are you sure you want to delete this job post?
        </p>
        <div className="flex justify-end space-x-4">
          <button
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
