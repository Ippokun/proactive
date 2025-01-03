'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUser } from '../../app/context/UserContext'; // Контекстыг ашиглан хэрэглэгчийн мэдээллийг шинэчилнэ

export default function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const [error, setError] = useState('');
    const { setUser } = useUser(); // Контекстыг ашиглан хэрэглэгчийн байдал шинэчлэгдэнэ
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
                localStorage.setItem('firstName', data.firstName); // Store firstName
                localStorage.setItem('lastName', data.lastName); // Store firstName
                localStorage.setItem('Email', data.email); // Store firstName
                localStorage.setItem('userId', data.userId); // Store userId
    
                setUser({
                    isLoggedIn: true,
                    role: data.role,
                    username: data.firstName, // Set username to firstName from the backend
                    lastname: data.lastName, // Set username to firstName from the backend
                    email: data.email, // Set username to firstName from the backend
                    userSecret: "", // Add logic if necessary to store userSecret
                    userId: data.userId, // Set userId
                });

                // const redirectPath = data.role === 'freelancer' ? "/freelancer" : "/client";
                 // Redirection based on role
                let redirectPath = "";
                if (data.role === 'freelancer') {
                    redirectPath = "/freelancer";
                } else if (data.role === 'client') {
                    redirectPath = "/client";
                } else if (data.role === 'admin') {
                    redirectPath = "/admin"; // Redirect to the admin dashboard
                }
                setTimeout(() => router.push(redirectPath), 2000);
                setMessage("Нэвтрэлт амжилттай боллоо!");
            } else {
                setMessage(data.error || "Нэвтрэхэд алдаа гарлаа!");
            }
        } catch (error) {
            console.error('Нэвтрэх явцад алдаа гарсан:', error);
            setMessage("Алдаа гарлаа. Дахин оролдоно уу.");
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
                <h1 className="text-2xl font-bold mb-4">Proactive Freelance-д нэвтрэх</h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="email">И-мэйл хаяг</label>
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
                        <label className="block text-sm font-medium text-gray-700" htmlFor="password">Нууц үг</label>
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
                        <p className={`text-center text-sm mt-4 ${message.includes("амжилттай") ? 'text-green-500' : 'text-red-500'}`}>
                            {message}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-md"
                    >
                        Нэвтрэх
                    </button>
                </form>
                <div className="mt-4 text-sm text-center text-gray-600">
                    Хэрэглэгчийн бүртгэл үүсгээгүй юу?{" "}
                    <Link href="/signup" className="text-blue-500 hover:underline">
                        Бүртгэл үүсгэх
                    </Link>
                </div>
            </div>
        </div>
    );
};
