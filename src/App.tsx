import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import AccountDetails from './pages/AccountDetails';
import StakeholderManagement from './pages/StakeholderManagement';
import OpportunityPipeline from './pages/OpportunityPipeline';
import StrategicInitiatives from './pages/StrategicInitiatives';
import Analytics from './pages/Analytics';

const App = () => {
  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Navigation />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - 240px)` },
            marginLeft: { sm: '240px' },
          }}
        >
          <Toolbar /> {/* This creates space for the AppBar */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/accounts" element={<Accounts />} />
            <Route path="/accounts/:id" element={<AccountDetails />} />
            <Route path="/stakeholders" element={<StakeholderManagement />} />
            <Route path="/opportunities" element={<OpportunityPipeline />} />
            <Route path="/initiatives" element={<StrategicInitiatives />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
};

export default App;
