"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ClientSignup() {
  const [isAgreed, setIsAgreed] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "freelancer",
  });

  const [errors, setErrors] = useState({
    email: "",
    passwordMatch: "",
  });

  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsAgreed(e.target.checked);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate logic
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setErrors((prev) => ({
        ...prev,
        email: emailRegex.test(value) ? "" : "Invalid email format.",
      }));
    }

    if (name === "confirmPassword" || name === "password") {
      setErrors((prev) => ({
        ...prev,
        passwordMatch:
          formData.password === value || formData.confirmPassword === value
          ? ""
          : "Passwords do not match.",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(""); // clear pre messages
    try { 
      const response = await fetch('http://localhost:4000/api/signup', {
        method: 'POST',
        headers:  { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage('Signup successful!');
        setTimeout(() => {
          router.push("/login")
        },2000);
      } else {
        const error = await response.json();
        setMessage(error.error || "Signup failed!")
      }
    } catch (err) {
        console.error('Error signing up:', err);
        setMessage('An error occured. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Find the work you are looking!</h1>

        <div className="mb-4 text-sm text-gray-600">
          <p>Not a Freelancer? </p>
          <Link href="/signup/Client" className="text-blue-500 hover:underline">
            Sign up as a Client
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="firstName">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="lastName">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="mt-1 p-2 block w-full border-gray-500 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700" htmlFor="confirmPassword">
              Re-enter Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {errors.passwordMatch && (
              <p className="text-red-500 text-sm mt-1">{errors.passwordMatch}</p>
            )}
          </div>

         {/* Checkbox for Terms of Service */}
         <div className="mb-4 text-sm text-gray-600">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="mr-2 h-4 w-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                checked={isAgreed}
                onChange={handleCheckboxChange}
              >
              </input>
              <span>
                Yes, I understand and agree to the{" "}
                <a href='#' className="text-blue-500 hover:underline">
                  Terms of Service
                </a>
                ,{""}
                <a href='#' className="text-blue-500 hover:underline">
                  Privacy Policy
                </a>
                .
              </span>
            </label>
          </div>

          {message && <p className="text-center text-sm mt-4 text-green-500">{message}</p>}
          <button
            type="submit"
            className={`w-full px-4 py-2 text-white font-medium rounded-md ${
              isAgreed ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"
            }`}
            disabled={!isAgreed}
          >
            Create Account
          </button>
        </form>

        <div className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
