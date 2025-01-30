import React from 'react';
import { Home, BarChart2, Info } from 'lucide-react';

interface NavigationProps {
  currentPage: 'home' | 'dashboard' | 'about';
  onPageChange: (page: 'home' | 'dashboard' | 'about') => void;
}

export default function Navigation({ currentPage, onPageChange }: NavigationProps) {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-sm mb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-4">
          <button
            onClick={() => onPageChange('home')}
            className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 ${
              currentPage === 'home'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Home className="w-4 h-4" />
            <span>Início</span>
          </button>

          <button
            onClick={() => onPageChange('dashboard')}
            className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 ${
              currentPage === 'dashboard'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => onPageChange('about')}
            className={`px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-2 ${
              currentPage === 'about'
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>Sobre</span>
          </button>
        </div>
      </div>
    </nav>
  );
}