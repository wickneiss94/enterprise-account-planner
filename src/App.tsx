import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AccountProvider } from './contexts/AccountContext';
import { ContactOpportunityProvider } from './contexts/ContactOpportunityContext';
import Layout from './components/Layout';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Accounts from './pages/Accounts';
import AccountDetails from './pages/AccountDetails';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AccountProvider>
                    <ContactOpportunityProvider>
                      <Layout>
                        <Routes>
                          <Route path="/" element={<Navigate to="/accounts" />} />
                          <Route path="/accounts" element={<Accounts />} />
                          <Route path="/accounts/:id" element={<AccountDetails />} />
                        </Routes>
                      </Layout>
                    </ContactOpportunityProvider>
                  </AccountProvider>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
