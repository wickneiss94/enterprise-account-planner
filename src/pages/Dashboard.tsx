import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Add as AddIcon,
} from '@mui/icons-material';

// Mock data - replace with actual data from your backend
const mockAccounts = [
  { id: 1, name: 'Acme Corp', revenue: 1500000, health: 85, status: 'Active' },
  { id: 2, name: 'TechStart Inc', revenue: 750000, health: 65, status: 'At Risk' },
  { id: 3, name: 'Global Solutions', revenue: 2500000, health: 92, status: 'Active' },
];

const Dashboard = () => {
  const totalRevenue = mockAccounts.reduce((sum, account) => sum + account.revenue, 0);
  const averageHealth = mockAccounts.reduce((sum, account) => sum + account.health, 0) / mockAccounts.length;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">Account Dashboard</Typography>
          <Button variant="contained" startIcon={<AddIcon />}>
            Add Account
          </Button>
        </Box>

        {/* Key Metrics */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Portfolio Value
              </Typography>
              <Typography variant="h4">${(totalRevenue / 1000000).toFixed(2)}M</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon color="success" />
                <Typography variant="body2" color="success.main" sx={{ ml: 1 }}>
                  +12% from last quarter
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Average Account Health
              </Typography>
              <Typography variant="h4">{averageHealth.toFixed(1)}%</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingDownIcon color="error" />
                <Typography variant="body2" color="error.main" sx={{ ml: 1 }}>
                  -3% from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ flex: 1 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Opportunities
              </Typography>
              <Typography variant="h4">12</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <TrendingUpIcon color="success" />
                <Typography variant="body2" color="success.main" sx={{ ml: 1 }}>
                  +2 new this month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Account List */}
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Key Accounts
        </Typography>
        <List>
          {mockAccounts.map((account) => (
            <ListItem key={account.id} divider>
              <ListItemText
                primary={account.name}
                secondary={`Annual Revenue: $${(account.revenue / 1000000).toFixed(2)}M`}
              />
              <ListItemSecondaryAction>
                <Chip
                  label={account.status}
                  color={account.status === 'Active' ? 'success' : 'error'}
                  size="small"
                />
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Dashboard; 