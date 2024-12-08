'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const RoleSelection = () => {
    const [selectedRole,  setSelectedRole ] = useState<'client' | 'freelancer' | null>(null);
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

    return(
        <div className="flex flex-col items-center justify-center mt-8">
            <h1 className="text-2xl font-semibold mb-4">Select Your Role</h1>
            <div className="flex gap-8">
                <div
                    className={`w-48 h-48 border-2 rounded-xl text-center p-4 cursor-pointer transition-transform duration-200 ease-in-out ${
                        selectedRole === 'client' ? 'bg-gray-100 border-blue-500' : 'bg-white border-gray-300'
                    } hover:scale-105`}
                    onClick={() => handleRoleSelect('client')}
                > 
                    <h2 className="text-xl font-medium">Client</h2>
                    <p className="text-sm mt-2">Find the talent you're looking for</p>
                </div>
                <div
                    className={`w-48 h-48 border-2 rounded-xl text-center p-4 cursor-pointer transition-transform duration-200 ease-in-out ${
                        selectedRole === 'freelancer' ? 'bg-gray-100 border-blue-500' : 'bg-white border-gray-300'
                    } hover:scale-105`}
                    onClick={() => handleRoleSelect('freelancer')}
                >
                    <h2 className="text-xl font-medium">Freelancer</h2>
                    <p className="text-sm mt-2">Get hired for yout skills</p>
                </div>
            </div>
            {selectedRole && (
                <div className="mt-4 text-lg font-medium">
                    {/* Diplaying the role in the button */}
                    <button
                     onClick={handleNavigate} // navigate to the corresponding registration page
                     className="px-6 py-2 mt-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                    > 
                    Join as {selectedRole === 'client' ? 'Client' : 'Freelancer'}</button> 
                </div>
            )}
        </div>
    );
};

export default RoleSelection;