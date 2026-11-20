import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './layouts/DashboardLayout';
import { PublicLayout } from './layouts/PublicLayout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { StoreDetail } from './pages/StoreDetail';
import { QRCodeView } from './pages/QRCodeView';
import { AnalyticsView } from './pages/AnalyticsView';
import { PublicReviewPage } from './pages/PublicReviewPage';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Landing />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="s/:slug" element={<PublicReviewPage />} />
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="dashboard/stores/:id" element={<StoreDetail />} />
              <Route path="dashboard/qr/:id" element={<QRCodeView />} />
              <Route path="dashboard/analytics/:id" element={<AnalyticsView />} />
            </Route>
          </Route>

          {/* Redirect old routes */}
          <Route path="/stores/:id" element={<Navigate to="/dashboard/stores/:id" replace />} />
          <Route path="/qr/:id" element={<Navigate to="/dashboard/qr/:id" replace />} />
          <Route path="/analytics/:id" element={<Navigate to="/dashboard/analytics/:id" replace />} />

          {/* Catch-all redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};