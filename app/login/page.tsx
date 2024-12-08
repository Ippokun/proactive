'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from '../../app/context/UserContext'; // Import the context to update user

export default function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const [error, setError] = useState('');
    const { setUser } = useUser(); // Use context to update user state
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (email: string, password: string) => {
        try {
            const response = await fetch("http://localhost:4000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);
                localStorage.setItem('firstName', data.firstName);

                setUser({
                    isLoggedIn: true,
                    role: data.role,
                });

                const redirectPath = data.role === 'freelancer' ? "/freelancer" : "/client";
                setTimeout(() => router.push(redirectPath), 2000);
                setMessage("Login successful!");
            } else {
                setMessage(data.error || "Login failed!");
            }
        } catch (error) {
            console.error('Error during login:', error);
            setMessage("An error occurred. Please try again.");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        handleLogin(formData.email, formData.password);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h1 className="text-2xl font-bold mb-4">Login to Proactive Freelance</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="mt-1 p-2 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    {message && (
                        <p className={`text-center text-sm mt-4 ${message.includes("succesful") ? 'text-green-500' : 'text-red-500'}`}>
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-md"
                    >
                        Login
                    </button>
                </form>
                <div className="mt-4 text-sm text-center text-gray-600">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-blue-500 hover:underline">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
};
