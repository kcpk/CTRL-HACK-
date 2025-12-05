
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeRisk from './pages/EmployeeRisk';
import SecureLinks from './pages/SecureLinks';
import LiveLogs from './pages/LiveLogs';
import AiAgents from './pages/AiAgents';
import BotActivity from './pages/BotActivity';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const PrivateRoute = ({ children }: { children?: React.ReactNode }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isLoginPage) return <>{children}</>;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-200">
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      <div className="flex flex-col flex-1 h-full min-w-0">
        <Header onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <HashRouter>
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/employees"
                element={
                  <PrivateRoute>
                    <EmployeeRisk />
                  </PrivateRoute>
                }
              />
              <Route
                path="/secure-links"
                element={
                  <PrivateRoute>
                    <SecureLinks />
                  </PrivateRoute>
                }
              />
              <Route
                path="/bots"
                element={
                  <PrivateRoute>
                    <BotActivity />
                  </PrivateRoute>
                }
              />
              <Route
                path="/logs"
                element={
                  <PrivateRoute>
                    <LiveLogs />
                  </PrivateRoute>
                }
              />
              <Route
                path="/ai-brain"
                element={
                  <PrivateRoute>
                    <AiAgents />
                  </PrivateRoute>
                }
              />
            </Routes>
          </Layout>
        </HashRouter>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
