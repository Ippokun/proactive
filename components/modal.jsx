"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "../app/context/UserContext"; // Import the context
import { FaUser, FaSignOutAlt } from "react-icons/fa"; // Import icons

export default function Modal({
  isOpen,
  onClose,
  profilePic,
}) {
  const { setUser, username, roleInMongolian  } = useUser(); // Access username and role from context
  const router = useRouter(); // Initialize the router
  console.log("username", username);
  console.log("role", roleInMongolian );

   // Determine the profile route based on the role
   const profileRoute =
   roleInMongolian === "Фрилансер"
     ? "/profile/profile_freelancer"
     : "/profile/profile_client";
  
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("roleInMongolian");
    localStorage.removeItem("username");
    localStorage.removeItem("userSecret");
    localStorage.removeItem("userId");

    // Reset user context state
    setUser({
      isLoggedIn: false,
      roleInMongolian : "",
      username: "",
      userSecret: "",
      userId: null,
    });

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
            <p className="font-semibold">{username}</p> {/* Displaying the username from context */}
            <p className="text-sm text-gray-500">{roleInMongolian }</p> {/* Displaying the role from context */}
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <Link href={profileRoute}>
            <div className="flex items-center space-x-2 p-2 border-b border-gray-300 hover:bg-gray-100 rounded cursor-pointer">
              <FaUser className="text-blue-600" />
              <p className="text-blue-600">Таны Профайл</p> {/* Mongolian translation */}
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 p-2 border-t border-gray-300 hover:bg-gray-100 w-full text-red-600 rounded cursor-pointer"
          >
            <FaSignOutAlt className="text-red-600" />
            <p>Гарах</p> {/* Mongolian translation */}
          </button>
        </div>
      </div>
    </div>
  );
}
