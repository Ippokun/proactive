"use client";

import { useEffect, useState } from "react";
import Modal from "./modal";
import { useUser } from "../app/context/UserContext"; // Adjust the path according to your project structure
import Link from "next/link";

export default function Header() {
  const { isLoggedIn, role } = useUser(); // Get the login status and role from the context

  return (
    <header>
      <div className="px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex-shrink-0">
            <Link href="/" title="Home">
              <img
                className="w-auto h-16"
                src="/asset/proLogo.png"
                alt="Logo"
              />
            </Link>
          </div>

          <button
            type="button"
            className="inline-flex p-1 text-black transition-all duration-200 border border-black lg:hidden focus:bg-gray-100 hover:bg-gray-100"
          >
            <svg
              className="block w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>

            <svg
              className="hidden w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>

          <div className="hidden ml-auto lg:flex lg:items-center lg:justify-center lg:space-x-10">
            {/* If user is logged in and is a client */}
            {isLoggedIn && role === 'client' && (
              <>
                <Link
                  href="/client/job-post"
                  className="text-base font-semibold text-black transition-all duration-200 hover:text-opacity-80"
                >
                  Ажил бүртгэх
                </Link>

                <Link
                  href="/solutions"
                  className="text-base font-semibold text-black transition-all duration-200 hover:text-opacity-80"
                >
                  Ажил хянах
                </Link>

                <Link
                  href="/solutions"
                  className="text-base font-semibold text-black transition-all duration-200 hover:text-opacity-80"
                >
                  Мессеж
                </Link>
              </>
            )}

            {/* If user is logged in and is a freelancer */}
            {isLoggedIn && role === 'freelancer' && (
              <>
                <Link
                  href="/freelancer/find-work"
                  className="text-base font-semibold text-black transition-all duration-200 hover:text-opacity-80"
                >
                  Оролцох ажил
                </Link>

                <Link
                  href="/freelancer/messages"
                  className="text-base font-semibold text-black transition-all duration-200 hover:text-opacity-80"
                >
                  Мессеж
                </Link>
              </>
            )}

            {/* If user is not logged in, show login and signup options */}
            {!isLoggedIn && (
              <>
                <Link
                  href="/login"
                  className="text-base font-semibold text-black transition-all duration-200 hover:text-opacity-80"
                >
                  Нэвтрэх
                </Link>

                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center px-5 py-2.5 text-base font-semibold text-black border-2 border-black hover:bg-black hover:text-white transition-all duration-200 focus:bg-black focus:text-white"
                  role="button"
                >
                  Бүртгүүлэх
                </Link>
              </>
            )}

            {/* If user is logged in, show a profile picture or avatar */}
            {isLoggedIn && (
              <div className="relative">
                <Link href="/profile">
                  {/* You can replace this with the actual user's profile picture */}
                  <img
                    src="/path/to/default-avatar.png" // Replace with actual user's avatar or default avatar path
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-black cursor-pointer"
                  />
                </Link>
              </div>
            )}

            <div className="w-px h-5 bg-black/20"></div>
          </div>
        </div>
      </div>
    </header>
  );
}
