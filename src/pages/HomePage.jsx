import React from 'react';
import { useOutletContext } from 'react-router-dom';
import MetricsOverview from '../components/MetricsOverview';
import Dashboard from '../components/Dashboard';

export default function HomePage() {
  const { stats, runs, onDeleteRun, onOpenAddForm, onOpenEditForm, onOpenViewForm } = useOutletContext();

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <div className="mb-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Cumulative Key Metrics
          </h3>
        </div>
        <MetricsOverview stats={stats} />
      </div>

      <div>
        <div className="mb-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Recent Workouts
          </h3>
        </div>
        <Dashboard 
          runs={runs}
          onDeleteRun={onDeleteRun}
          onOpenAddForm={onOpenAddForm}
          onOpenEditForm={onOpenEditForm}
          onOpenViewForm={onOpenViewForm}
        />
      </div>
    </div>
  );
}
