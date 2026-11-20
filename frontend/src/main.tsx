import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from './components/ui/Toast';
import { useToast } from './hooks/useToast';
import { AuthProvider } from './context/AuthContext';
import { App } from './App';
import './index.css';

function AppWithToaster() {
  const { toasts, removeToast } = useToast();
  return (
    <>
      <App />
      <Toaster toasts={toasts} onClose={removeToast} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppWithToaster />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);