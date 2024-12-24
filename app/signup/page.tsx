'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const RoleSelection = () => {
    const [selectedRole, setSelectedRole] = useState<'client' | 'freelancer' | null>(null);
    const router = useRouter();

    const handleRoleSelect = (role: 'client' | 'freelancer') => {
        setSelectedRole(role);
    };

    const handleNavigate = () => {
        if (selectedRole === 'client') {
            router.push(`/signup/Client`);
        } else if (selectedRole === 'freelancer') {
            router.push(`/signup/Freelancer`);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center -mt-20">
            <div className="flex flex-col items-center justify-center bg-white/50 p-12 rounded-3xl backdrop-blur-sm">
                <h1 className="text-3xl font-bold mb-12 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                    Хэрэглэгчийн бүртгэлээ Сонгоно уу
                </h1>
                <div className="flex gap-12">
                    <div
                        className={`w-72 h-72 rounded-3xl text-center p-8 cursor-pointer transition-all duration-300 ease-in-out 
                            ${selectedRole === 'client' 
                                ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-4 border-blue-500 shadow-xl shadow-blue-200/50' 
                                : 'bg-white border-4 border-gray-200 hover:border-blue-300 shadow-lg'
                            } hover:scale-105 hover:shadow-2xl group`}
                        onClick={() => handleRoleSelect('client')}
                    >
                        <div className="h-full flex flex-col justify-between">
                            <h2 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                Фрилансе хөлслөгч
                            </h2>
                            <p className="text-base mt-4 text-gray-600">
                                Хайж буй авьяасаа олоорой.
                            </p>
                        </div>
                    </div>
                    <div
                        className={`w-72 h-72 rounded-3xl text-center p-8 cursor-pointer transition-all duration-300 ease-in-out 
                            ${selectedRole === 'freelancer' 
                                ? 'bg-gradient-to-br from-blue-50 to-blue-100 border-4 border-blue-500 shadow-xl shadow-blue-200/50' 
                                : 'bg-white border-4 border-gray-200 hover:border-blue-300 shadow-lg'
                            } hover:scale-105 hover:shadow-2xl group`}
                        onClick={() => handleRoleSelect('freelancer')}
                    >
                        <div className="h-full flex flex-col justify-between">
                            <h2 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                                Фрилансер
                            </h2>
                            <p className="text-base mt-4 text-gray-600">
                                Өөрийн ур чадвараар тохирсон хүссэн ажлаа олоорой.
                            </p>
                        </div>
                    </div>
                </div>
                {selectedRole && (
                    <div className="mt-12">
                        <button
                            onClick={handleNavigate}
                            className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-lg font-bold rounded-2xl 
                                hover:from-blue-700 hover:to-blue-600 transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                        >
                            {selectedRole === 'client' ? 'Фрилансе хөлслөгч' : 'Фрилансер'}-ээр бүртгүүлэх
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RoleSelection;