import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, QrCode, BarChart3, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/helpers';

const navItems = [
  { path: '/dashboard', label: 'Stores', icon: LayoutDashboard },
  { path: '/dashboard/qr', label: 'QR Codes', icon: QrCode },
  { path: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const { logout } = useAuth();
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] w-64 border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 lg:static lg:h-auto lg:w-64 lg:border-0 lg:bg-transparent">
      <nav className="flex h-full flex-col px-4 py-6 lg:p-0" aria-label="Dashboard navigation">
        <ul className="flex flex-1 flex-col gap-1 lg:gap-0">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="border-t border-gray-200 pt-4 lg:border-0 lg:pt-0">
          <button
            onClick={logout}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-600',
              'hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white'
            )}
          >
            <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </nav>
    </aside>
  );
};