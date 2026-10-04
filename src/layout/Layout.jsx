import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu, Plus, Calendar, X } from 'lucide-react';
import AddRunForm from '../components/AddRunForm';

export default function Layout({ 
  runs, 
  onAddRun, 
  onEditRun,
  onDeleteRun, 
  stats 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalConfig, setModalConfig] = useState({ isOpen: false, mode: 'add', run: null });

  const handleOpenAdd = () => setModalConfig({ isOpen: true, mode: 'add', run: null });
  const handleOpenEdit = (run) => setModalConfig({ isOpen: true, mode: 'edit', run });
  const handleOpenView = (run) => setModalConfig({ isOpen: true, mode: 'view', run });
  const handleCloseModal = () => setModalConfig({ isOpen: false, mode: 'add', run: null });

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-white text-gray-900 flex">
      {/* Persistent Left Sidebar */}
      <Sidebar
        totalRuns={runs.length}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:pl-64">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 md:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-base sm:text-lg font-bold text-gray-900 leading-tight">
                Executive Dashboard
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-1.5 text-xs text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <span>{todayFormatted}</span>
            </div>

            <button
              onClick={handleOpenAdd}
              className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Add Workout</span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Outlet with Context */}
        <main className="flex-1 bg-white p-4 sm:p-6 lg:p-8">
          <Outlet context={{ runs, onAddRun, onEditRun, onDeleteRun, stats, onOpenAddForm: handleOpenAdd, onOpenEditForm: handleOpenEdit, onOpenViewForm: handleOpenView }} />
        </main>
      </div>

      {/* Modal for AddRunForm */}
      {modalConfig.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl my-8">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-2 pt-6">
              <AddRunForm
                initialData={modalConfig.run}
                isViewOnly={modalConfig.mode === 'view'}
                isEditMode={modalConfig.mode === 'edit'}
                onAddRun={onAddRun}
                onEditRun={onEditRun}
                onViewReport={handleCloseModal}
                onCancel={handleCloseModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
