import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { TrendingUp, Activity, BarChart3, Mountain } from 'lucide-react';

export default function TrendsPage() {
  const { runs, stats } = useOutletContext();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-emerald-600" />
          Performance Trends
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Analyze your running pace and mileage progression over time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distance Progression */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col items-center justify-center min-h-[300px] text-center group hover:border-emerald-300 transition-colors">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <BarChart3 className="w-6 h-6 text-emerald-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Distance Progression</h3>
          <p className="text-sm text-gray-500 max-w-sm">
            Visual charts for your weekly mileage trends will be generated here soon. You have logged {runs.length} workouts so far!
          </p>
        </div>

        {/* Pace Analysis */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col items-center justify-center min-h-[300px] text-center group hover:border-blue-300 transition-colors">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Activity className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pace Analysis</h3>
          <p className="text-sm text-gray-500 max-w-sm">
            Detailed breakdown of your average pace across different types of runs (Recovery, Tempo, Intervals).
          </p>
        </div>
      </div>
    </div>
  );
}
