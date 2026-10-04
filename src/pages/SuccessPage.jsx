import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ArrowLeft } from 'lucide-react';

export default function SuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center animate-in zoom-in-95 duration-500">
        
        {/* Animated Checkmark */}
        <div className="relative mx-auto w-24 h-24 mb-6">
          <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-75"></div>
          <div className="relative w-full h-full bg-emerald-50 rounded-full flex items-center justify-center border-4 border-emerald-100">
            <CheckCircle className="w-12 h-12 text-emerald-500 animate-in spin-in-12 duration-700" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
          Successfully Submitted!
        </h1>
        <p className="text-sm text-gray-500 mb-8">
          Your workout has been securely logged into the system. Keep up the great work!
        </p>

        <button
          onClick={() => navigate('/add-workout')}
          className="w-full flex items-center justify-center space-x-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 transition-colors shadow-md"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Submit Another Workout</span>
        </button>

      </div>
    </div>
  );
}
