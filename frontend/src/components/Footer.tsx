import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary-600" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">Magic Review</span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
            <Link to="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              Home
            </Link>
            <Link to="/login" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              Sign Up
            </Link>
          </nav>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Magic Review. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};