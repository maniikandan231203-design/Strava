import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Activity, 
  RefreshCw, 
  ChevronRight, 
  TrendingUp, 
  Settings, 
  X,
  Plus
} from 'lucide-react';

/**
 * Modular Navigation Configuration
 * Add new modules here to automatically render in the sidebar.
 */
export const NAVIGATION_MODULES = [
  {
    id: 'dashboard',
    name: 'Home / Dashboard',
    path: '/',
    icon: LayoutDashboard,
    badge: null,
    description: 'Executive overview & analytics'
  },
  // Future module placeholders (modular & extendable)
  {
    id: 'performance',
    name: 'Performance Trends',
    path: '/trends',
    icon: TrendingUp,
    badge: 'Beta',
    badgeVariant: 'neutral',
    description: 'Pace & mileage projections'
  },
  {
    id: 'settings',
    name: 'Settings',
    path: '/settings',
    icon: Settings,
    badge: null,
    disabled: true,
    description: 'System & user preferences'
  }
];

export default function Sidebar({ 
  totalRuns = 0, 
  isOpen = false, 
  onClose = () => {} 
}) {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-gray-900/30 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Persistent Sidebar */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-50 border-r border-gray-200 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top: Brand & App Title */}
        <div>
          <div className="h-16 px-5 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center text-white shadow-xs">
                <Activity className="w-4 h-4 text-emerald-400 stroke-[2.5]" />
              </div>
              <div>
                <span className="text-sm font-bold text-gray-900 tracking-tight flex items-center gap-1.5">
                  Stride<span className="text-emerald-600">Pulse</span>
                </span>
              </div>
            </div>

            {/* Mobile close button */}
            <button 
              onClick={onClose}
              className="p-1 rounded-md text-gray-400 hover:text-gray-600 md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Module Navigation List */}
          <div className="p-3">
            <div className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-400">
              Modules
            </div>

            <nav className="space-y-1">
              {NAVIGATION_MODULES.map((item) => {
                const IconComponent = item.icon;
                const isComingSoon = item.disabled;

                if (isComingSoon) {
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-gray-400 cursor-not-allowed select-none group"
                      title={`${item.name} (Coming soon)`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <IconComponent className="w-4 h-4 text-gray-400" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded bg-gray-200 text-gray-600">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  );
                }

                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    onClick={() => onClose()}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-gray-200/80 text-gray-900 font-semibold shadow-xs'
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`
                    }
                  >
                    <div className="flex items-center space-x-2.5">
                      <IconComponent className="w-4 h-4 text-gray-600" />
                      <span>{item.name}</span>
                    </div>

                    {item.badgeKey === 'totalRuns' && totalRuns > 0 && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white text-gray-700 border border-gray-200">
                        {totalRuns}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="p-3 border-t border-gray-200 bg-slate-50 flex items-center justify-center text-xs text-gray-400">
          StridePulse v1.0.0
        </div>
      </aside>
    </>
  );
}
