import React from 'react';
import { Route, Zap, Mountain, Trophy } from 'lucide-react';

export default function MetricsOverview({ stats }) {
  const cards = [
    {
      label: 'Total Distance',
      value: `${stats.totalDistance} km`,
      subtext: `${stats.totalRuns} total activities logged`,
      icon: Route,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      label: 'Average Pace',
      value: stats.avgPace,
      subtext: 'Weighted across all workouts',
      icon: Zap,
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    },
    {
      label: 'Elevation Gain',
      value: `${stats.totalElevation} m`,
      subtext: 'Total vertical elevation gained',
      icon: Mountain,
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      label: 'Longest Run',
      value: `${stats.longestRun} km`,
      subtext: 'Single activity maximum record',
      icon: Trophy,
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:border-gray-300 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                {card.label}
              </span>
              <div className={`p-2 rounded-lg border ${card.badgeColor}`}>
                <IconComponent className="w-4 h-4 stroke-[2.2]" />
              </div>
            </div>
            <div className="text-2xl font-bold tracking-tight text-gray-900">
              {card.value}
            </div>
          </div>
        );
      })}
    </div>
  );
}
