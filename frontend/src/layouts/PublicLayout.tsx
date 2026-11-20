import React from 'react';
import { Outlet } from 'react-router-dom';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <main className="min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};