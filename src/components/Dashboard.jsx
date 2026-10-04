import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Calendar, 
  Trash2, 
  Clock, 
  Mountain, 
  Route, 
  Plus, 
  Filter, 
  X, 
  FileDown, 
  ChevronDown,
  LayoutGrid,
  List,
  Eye,
  Pencil
} from 'lucide-react';
import { formatDate } from '../utils/formatters';

export default function Dashboard({ runs, onDeleteRun, onOpenAddForm, onOpenEditForm, onOpenViewForm }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateSort, setDateSort] = useState('newest'); // 'newest' | 'oldest'
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | '7days' | '30days' | 'year'
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'Run' | 'Walk'
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards'

  const filteredRuns = useMemo(() => {
    return runs
      .filter((run) => {
        const matchesName = run.name.toLowerCase().includes(searchQuery.toLowerCase().trim());
        if (!matchesName) return false;

        if (typeFilter !== 'all' && run.type !== typeFilter) return false;

        if (dateFilter !== 'all' && run.date) {
          const runTime = new Date(run.date).getTime();
          const now = new Date().getTime();
          const diffDays = (now - runTime) / (1000 * 3600 * 24);

          if (dateFilter === '7days' && diffDays > 7) return false;
          if (dateFilter === '30days' && diffDays > 30) return false;
          if (dateFilter === 'year' && diffDays > 365) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();

        if (dateSort === 'newest') {
          return dateB - dateA;
        } else {
          return dateA - dateB;
        }
      });
  }, [runs, searchQuery, dateSort, dateFilter, typeFilter]);

  const handleExportCSV = () => {
    if (runs.length === 0) return;
    const headers = ['Name', 'Date', 'Distance (km)', 'Avg Pace', 'Moving Time', 'Elevation Gain (m)', 'Type'];
    const rows = runs.map((r) => [
      `"${r.name.replace(/"/g, '""')}"`,
      r.date,
      r.distance,
      `"${r.avgPace}"`,
      `"${r.movingTime}"`,
      r.elevationGain,
      `"${r.type || 'Run'}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `running_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Filter and Actions Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Search by Name */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              id="search-run-name"
              type="text"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-lg pl-9 pr-8 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Filter by Type */}
            <div className="relative min-w-[120px]">
              <select
                id="filter-type"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 cursor-pointer transition-colors"
              >
                <option value="all">All Types</option>
                <option value="Run">Run</option>
                <option value="Walk">Walk</option>
              </select>
              <Filter className="absolute right-2.5 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Sort by Date */}
            <div className="relative min-w-[170px]">
              <select
                id="sort-date"
                value={dateSort}
                onChange={(e) => setDateSort(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 cursor-pointer transition-colors"
              >
                <option value="newest">Date: Newest First</option>
                <option value="oldest">Date: Oldest First</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* Filter by Date Period */}
            <div className="relative min-w-[150px]">
              <select
                id="filter-date-period"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full appearance-none bg-white border border-gray-300 rounded-lg px-3 py-2 pr-8 text-sm text-gray-700 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 cursor-pointer transition-colors"
              >
                <option value="all">All Dates</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="year">Past Year</option>
              </select>
              <Filter className="absolute right-2.5 top-2.5 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200">
              <button
                onClick={() => setViewMode('table')}
                title="Table View"
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'table' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('cards')}
                title="Grid Cards View"
                className={`p-1.5 rounded-md transition-colors ${
                  viewMode === 'cards' ? 'bg-white text-gray-900 shadow-xs' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            {/* CSV Export */}
            {runs.length > 0 && (
              <button
                onClick={handleExportCSV}
                className="flex items-center space-x-1.5 text-xs font-medium px-3 py-2 rounded-lg bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 transition-colors"
                title="Export runs to CSV"
              >
                <FileDown className="w-3.5 h-3.5 text-gray-500" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
            )}

            {/* Add Run Quick Action */}
            {onOpenAddForm && (
              <button
                onClick={onOpenAddForm}
                className="flex items-center space-x-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg bg-gray-900 hover:bg-gray-800 text-white shadow-xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>Add Run</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Filter Chips */}
        {(searchQuery || typeFilter !== 'all' || dateFilter !== 'all' || dateSort !== 'newest') && (
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
            <div className="flex items-center flex-wrap gap-2">
              <span className="font-medium text-gray-400">Active filters:</span>
              {searchQuery && (
                <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 border border-gray-200 flex items-center space-x-1">
                  <span>Name: "{searchQuery}"</span>
                  <X className="w-3 h-3 cursor-pointer text-gray-500 hover:text-gray-700" onClick={() => setSearchQuery('')} />
                </span>
              )}
              {typeFilter !== 'all' && (
                <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 border border-purple-200 flex items-center space-x-1">
                  <span>Type: {typeFilter}</span>
                  <X className="w-3 h-3 cursor-pointer text-purple-500 hover:text-purple-700" onClick={() => setTypeFilter('all')} />
                </span>
              )}
              {dateFilter !== 'all' && (
                <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 flex items-center space-x-1">
                  <span>Period: {dateFilter}</span>
                  <X className="w-3 h-3 cursor-pointer text-blue-500 hover:text-blue-700" onClick={() => setDateFilter('all')} />
                </span>
              )}
              {dateSort !== 'newest' && (
                <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 border border-gray-200 flex items-center space-x-1">
                  <span>Sort: Oldest first</span>
                  <X className="w-3 h-3 cursor-pointer text-gray-500 hover:text-gray-700" onClick={() => setDateSort('newest')} />
                </span>
              )}
            </div>

            <button
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('all');
                setDateFilter('all');
                setDateSort('newest');
              }}
              className="text-gray-500 hover:text-gray-900 underline text-xs font-medium"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area: Table or Card Grid */}
      {filteredRuns.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <div className="mx-auto w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 mb-3 border border-gray-200">
            <Route className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">
            {runs.length === 0 ? 'No running entries recorded' : 'No matching activities found'}
          </h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto mb-5">
            {runs.length === 0
              ? 'Begin logging workouts with distance, pace, and elevation to populate your report table.'
              : 'Try clearing the search query or adjusting the date range filters to view other activities.'}
          </p>
          {runs.length === 0 && onOpenAddForm ? (
            <button
              onClick={onOpenAddForm}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-gray-900 hover:bg-gray-800 transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record First Run</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('all');
                setDateFilter('all');
              }}
              className="inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-lg text-xs font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      ) : viewMode === 'table' ? (
        /* Enterprise Light Data Table */
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-[11px] font-semibold uppercase tracking-wider text-gray-600">
                  <th scope="col" className="py-4 px-4">Name</th>
                  <th scope="col" className="py-4 px-4 text-center">Date</th>
                  <th scope="col" className="py-4 px-4 text-center">Distance</th>
                  <th scope="col" className="py-4 px-4 text-center">Avg Pace</th>
                  <th scope="col" className="py-4 px-4 text-center">Moving Time</th>
                  <th scope="col" className="py-4 px-4 text-center">Elevation</th>
                  <th scope="col" className="py-4 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {filteredRuns.map((run) => {
                  return (
                    <tr
                      key={run.id}
                      className="hover:bg-gray-50/80 transition-colors group"
                    >
                      {/* Name & Type */}
                      <td className="py-4 px-4">
                        <div className="font-semibold text-gray-900 group-hover:text-emerald-700 transition-colors">
                          {run.name}
                        </div>
                        {run.type && (
                          <span className="inline-block mt-0.5 text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                            {run.type}
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 whitespace-nowrap text-gray-600 text-center">
                        <div className="flex items-center justify-center space-x-1.5 text-xs font-medium">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <span>{formatDate(run.date)}</span>
                        </div>
                      </td>

                      {/* Distance */}
                      <td className="py-4 px-4 whitespace-nowrap text-center">
                        <div className="font-semibold text-gray-900">
                          {run.distance} <span className="text-xs font-normal text-gray-500">km</span>
                        </div>
                      </td>

                      {/* Avg Pace */}
                      <td className="py-4 px-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold font-mono bg-blue-50 text-blue-700 border border-blue-200">
                          {run.avgPace}
                        </span>
                      </td>

                      {/* Moving Time */}
                      <td className="py-4 px-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-1 text-gray-700 font-mono text-xs font-medium">
                          <Clock className="w-3.5 h-3.5 text-gray-400" />
                          <span>{run.movingTime}</span>
                        </div>
                      </td>

                      {/* Elevation Gain */}
                      <td className="py-4 px-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-1 text-amber-700 text-xs font-medium">
                          <Mountain className="w-3.5 h-3.5 text-amber-600" />
                          <span>{run.elevationGain} m</span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => onOpenViewForm && onOpenViewForm(run)}
                            title="View workout entry"
                            className="p-1.5 rounded-md text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onOpenEditForm && onOpenEditForm(run)}
                            title="Edit workout entry"
                            className="p-1.5 rounded-md text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => onDeleteRun(run.id)}
                            title="Delete workout entry"
                            className="p-1.5 rounded-md text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between">
            <span>Showing {filteredRuns.length} of {runs.length} total activities</span>
            <span>All metrics verified</span>
          </div>
        </div>
      ) : (
        /* Flat White Grid Cards */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRuns.map((run) => (
            <div
              key={run.id}
              className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:border-gray-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-sm leading-snug">
                      {run.name}
                    </h4>
                    <span className="text-xs text-gray-500 flex items-center space-x-1 mt-0.5">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span>{formatDate(run.date)}</span>
                    </span>
                  </div>
                  {run.type && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
                      {run.type}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 py-3 border-y border-gray-100 my-3">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-gray-400 block">
                      Distance
                    </span>
                    <span className="text-base font-bold text-gray-900">
                      {run.distance} <span className="text-xs font-normal text-gray-500">km</span>
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-gray-400 block">
                      Avg Pace
                    </span>
                    <span className="text-xs font-semibold font-mono text-blue-700">
                      {run.avgPace}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-gray-400 block">
                      Moving Time
                    </span>
                    <span className="text-xs font-medium text-gray-700 font-mono">
                      {run.movingTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-gray-400 block">
                      Elevation
                    </span>
                    <span className="text-xs font-medium text-amber-700 flex items-center space-x-1">
                      <Mountain className="w-3 h-3" />
                      <span>{run.elevationGain} m</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end pt-2 border-t border-gray-100 mt-2 space-x-1">
                <button
                  onClick={() => onOpenViewForm && onOpenViewForm(run)}
                  title="View"
                  className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors rounded-md hover:bg-blue-50"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onOpenEditForm && onOpenEditForm(run)}
                  title="Edit"
                  className="p-1.5 text-gray-400 hover:text-emerald-600 transition-colors rounded-md hover:bg-emerald-50"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteRun(run.id)}
                  title="Delete"
                  className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors rounded-md hover:bg-rose-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
