import React from "react";

export default function Modal({ isOpen, onClose, userName, userRole, profilePic }) {
  if (!isOpen) return null; // If the modal isn't open, return nothing

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-80">
        <div className="flex items-center space-x-4">
          <img
            src={profilePic || "/defaultProfilePic.png"} // Fallback image
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
            <a className="block text-blue-600 hover:underline">Your Profile</a>
          </Link>
          <button
            onClick={onClose}
            className="block w-full text-red-600 hover:underline mt-2"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-2xl text-white"
      >
        ×
      </button>
    </div>
  );
}
