"use client"
import { useEffect, useState } from 'react';
import { redirect, useRouter } from 'next/navigation';
import {  LogIn, LogOut, Home, Activity, History, Puzzle, HeartPulse } from 'lucide-react';
// import getUserId from '@/utils/getUserId';
import { useAuth, UserButton, } from '@clerk/nextjs';

export default function Navbar() {
  const router = useRouter();
 
  const { userId } = useAuth();
  const handleSignOut =  () => {
    router.push("/sign-in")

  };
  useEffect(() => {
    if (!userId) {
      router.push('/sign-in');
    }
  }, [userId, router]);

  return (userId &&
    <nav className="bg-gradient-to-r from-blue-500 to-blue-800 shadow-xl fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex-shrink-0 text-white font-extrabold text-xl tracking-wide cursor-pointer" onClick={() => router.push('/')}>Cause AI</div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-6">
            <button onClick={() => router.push('/')} className="text-white flex items-center space-x-2 hover:text-gray-200 transition-all duration-300">
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>
            <button onClick={() => router.push('/diagnose')} className="text-white flex items-center space-x-2 hover:text-gray-200 transition-all duration-300">
              <Activity className="w-5 h-5" />
              <span>Diagnose</span>
            </button>
            <button onClick={() => router.push('/history')} className="text-white flex items-center space-x-2 hover:text-gray-200 transition-all duration-300">
              <History className="w-5 h-5" />
              <span>History</span>
            </button>
            <button
              onClick={() => router.push('/quiz')}
              className="text-white flex items-center space-x-2 hover:text-gray-200 transition-all duration-300"
              >
                <Puzzle className="w-5 h-5" />
              <span>Quiz</span>
              </button>
              <button
               onClick={() => router.push('/heartrate')}
                className="text-white flex items-center space-x-2 hover:text-gray-200 transition-all duration-300"
              >
                <HeartPulse className="w-5 h-5 animate-pulse text-red-500" />
                <span>Heart Rate</span>
              </button>

          </div>
      
          {/* Buttons */}
          <div className="flex items-center space-x-4">
            {/* {userId ? (
              
              <button
              onClick={handleSignOut}
                className="text-white flex items-center space-x-2 bg-red-600 px-3 py-2 rounded-lg shadow-md hover:bg-red-500 transition-all duration-300"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
              
            ) : (
              <button
                onClick={handleLogin}
                className="text-white flex items-center space-x-2 bg-green-600 px-3 py-2 rounded-lg shadow-md hover:bg-green-500 transition-all duration-300"
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </button>
            )} */}

            
            <UserButton/>
          </div>
        </div>
      </div>

      {/* Animation Bar */}
      <div className="h-1 bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-300 animate-pulse"></div>
    </nav>
  );
}
