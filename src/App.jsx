import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout/Layout';
import HomePage from './pages/HomePage';
import TrendsPage from './pages/TrendsPage';
import PublicAddWorkoutPage from './pages/PublicAddWorkoutPage';
import SuccessPage from './pages/SuccessPage';
import { calculateStats } from './utils/formatters';
import { supabase } from './lib/supabase';
import { CheckCircle2, Info } from 'lucide-react';

export default function App() {
  // Local runs state with localStorage persistence
  const [runs, setRuns] = useState([]);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch runs on mount
  useEffect(() => {
    fetchRuns();
  }, []);

  const fetchRuns = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('runs')
        .select('*')
        .order('date', { ascending: false });
        
      if (error) throw error;
      
      const formattedData = (data || []).map(run => ({
        id: run.id,
        name: run.name,
        date: run.date,
        distance: run.distance,
        avgPace: run.avg_pace,
        movingTime: run.moving_time,
        elevationGain: run.elevation_gain,
        type: run.type
      }));
      
      setRuns(formattedData);
    } catch (error) {
      console.error('Error fetching runs:', error);
      setToast({ type: 'error', message: 'Failed to load runs from database' });
    } finally {
      setLoading(false);
    }
  };

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Edit run handler
  const handleEditRun = async (updatedRun) => {
    try {
      const dbRun = {
        name: updatedRun.name,
        date: updatedRun.date,
        distance: updatedRun.distance,
        avg_pace: updatedRun.avgPace,
        moving_time: updatedRun.movingTime,
        elevation_gain: updatedRun.elevationGain,
        type: updatedRun.type
      };

      const { error } = await supabase
        .from('runs')
        .update(dbRun)
        .eq('id', updatedRun.id);

      if (error) throw error;

      setRuns((prev) => prev.map((r) => (r.id === updatedRun.id ? updatedRun : r)));
      setToast({
        type: 'success',
        message: `"${updatedRun.name}" was successfully updated!`,
      });
    } catch (error) {
      console.error('Error updating run:', error);
      setToast({ type: 'error', message: 'Failed to update run in database' });
    }
  };

  // Add run handler
  const handleAddRun = async (newRun) => {
    try {
      const dbRun = {
        name: newRun.name,
        date: newRun.date,
        distance: newRun.distance,
        avg_pace: newRun.avgPace,
        moving_time: newRun.movingTime,
        elevation_gain: newRun.elevationGain,
        type: newRun.type
      };

      const { data, error } = await supabase
        .from('runs')
        .insert([dbRun])
        .select();

      if (error) throw error;
      
      if (data && data[0]) {
        const insertedRun = {
          ...newRun,
          id: data[0].id
        };
        setRuns((prev) => [insertedRun, ...prev].sort((a, b) => new Date(b.date) - new Date(a.date)));
        setToast({
          type: 'success',
          message: `"${insertedRun.name}" was successfully logged!`,
        });
      }
    } catch (error) {
      console.error('Error adding run:', error);
      setToast({ type: 'error', message: 'Failed to add run to database' });
    }
  };

  // Delete run handler
  const handleDeleteRun = async (runId) => {
    try {
      const { error } = await supabase
        .from('runs')
        .delete()
        .eq('id', runId);

      if (error) throw error;

      const runToDelete = runs.find((r) => r.id === runId);
      setRuns((prev) => prev.filter((r) => r.id !== runId));
      setToast({
        type: 'info',
        message: `Deleted "${runToDelete?.name || 'Workout'}" from records.`,
      });
    } catch (error) {
      console.error('Error deleting run:', error);
      setToast({ type: 'error', message: 'Failed to delete run from database' });
    }
  };

  // Calculate stats dynamically
  const stats = calculateStats(runs);

  return (
    <>
      <Routes>
        {/* Public Standalone Route */}
        <Route path="/add-workout" element={<PublicAddWorkoutPage onAddRun={handleAddRun} />} />
        <Route path="/success" element={<SuccessPage />} />

        {/* Admin Dashboard Routes */}
        <Route
          path="/admin"
          element={
            <Layout
              runs={runs}
              onAddRun={handleAddRun}
              onEditRun={handleEditRun}
              onDeleteRun={handleDeleteRun}
              stats={stats}
            />
          }
        >
          <Route index element={<HomePage />} />
          <Route path="trends" element={<TrendsPage />} />
        </Route>

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>

      {/* Enterprise Light Mode Floating Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg border border-gray-200 bg-white text-gray-900 animate-in fade-in slide-in-from-bottom-3 duration-200">
            {toast.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <Info className="w-5 h-5 text-blue-600 shrink-0" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}
    </>
  );
}
