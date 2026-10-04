import React from 'react';
import AddRunForm from '../components/AddRunForm';
import { Activity } from 'lucide-react';

export default function PublicAddWorkoutPage({ onAddRun }) {
  return (
    <div className="min-h-screen bg-white md:bg-slate-50 flex flex-col items-center justify-start md:justify-center p-0 md:p-8">
      <div className="w-full max-w-none md:max-w-lg bg-white rounded-none md:rounded-xl shadow-none md:shadow-lg border-none md:border md:border-gray-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Brand Header */}
        <div className="bg-gray-900 px-6 py-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white border border-gray-700 shadow-inner">
              <Activity className="w-5 h-5 text-emerald-400 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-base font-bold text-white tracking-tight flex items-center gap-1.5">
                Stride<span className="text-emerald-400">Pulse</span>
              </span>
              <p className="text-[10px] uppercase font-semibold tracking-wider text-gray-400 mt-0.5">
                Public Workout Submission
              </p>
            </div>
          </div>
        </div>

        {/* Reusable Form Component */}
        <div className="p-4 sm:p-6">
          <AddRunForm 
            onAddRun={onAddRun}
            hideHeader={true}
            isPublic={true}
            onCancel={() => {
              // Just clear/reset or do nothing, no admin links allowed!
              window.location.reload(); 
            }}
          />
        </div>
      </div>
    </div>
  );
}
