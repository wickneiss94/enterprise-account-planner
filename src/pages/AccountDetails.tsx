import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Button,
  Card,
  CardContent,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Edit as EditIcon, DragIndicator as DragIcon } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import StakeholderMap from '../components/StakeholderMap';

// Mock data - replace with actual data from your backend
const mockAccount = {
  id: '1',
  name: 'Acme Corp',
  industry: 'Technology',
  annualRevenue: 1500000,
  employees: 500,
  status: 'Active',
  healthScore: 85,
  lastContactDate: '2024-04-15',
  address: '123 Tech Park, Silicon Valley, CA',
  website: 'www.acmecorp.com',
  description: 'Leading provider of cloud solutions and enterprise software.',
  contacts: [
    { 
      id: 1,
      name: 'John Smith',
      title: 'CTO',
      email: 'john@acmecorp.com',
      influence: 'High' as const,
      relationship: 'Champion' as const
    },
    { 
      id: 2,
      name: 'Sarah Johnson',
      title: 'Procurement Manager',
      email: 'sarah@acmecorp.com',
      influence: 'Medium' as const,
      relationship: 'Supporter' as const
    },
    { 
      id: 3,
      name: 'Michael Chen',
      title: 'IT Director',
      email: 'michael@acmecorp.com',
      influence: 'High' as const,
      relationship: 'Neutral' as const
    },
    { 
      id: 4,
      name: 'Lisa Wong',
      title: 'CFO',
      email: 'lisa@acmecorp.com',
      influence: 'High' as const,
      relationship: 'Blocker' as const
    }
  ],
  recentActivities: [
    { date: '2024-04-15', type: 'Meeting', description: 'Quarterly Business Review' },
    { date: '2024-04-10', type: 'Email', description: 'Product roadmap discussion' },
    { date: '2024-04-05', type: 'Call', description: 'Contract renewal planning' },
  ],
};

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`account-tabpanel-${index}`}
      aria-labelledby={`account-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const AccountDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [tabValue, setTabValue] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4">{mockAccount.name}</Typography>
            <Typography variant="subtitle1" color="textSecondary">
              {mockAccount.industry}
            </Typography>
          </Box>
          <Button variant="outlined" startIcon={<EditIcon />}>
            Edit Account
          </Button>
        </Box>
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Chip
            label={mockAccount.status}
            color={mockAccount.status === 'Active' ? 'success' : 'error'}
          />
          <Chip label={`Health Score: ${mockAccount.healthScore}%`} color="primary" />
        </Box>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ width: '100%' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="account tabs">
          <Tab label="Overview" />
          <Tab label="Activities" />
          <Tab label="Contacts" />
          <Tab label="Stakeholder Map" />
        </Tabs>
        <Divider />

        {/* Overview Tab */}
        <TabPanel value={tabValue} index={0}>
          <List>
            <ListItem>
              <ListItemText
                primary="Annual Revenue"
                secondary={`$${(mockAccount.annualRevenue / 1000000).toFixed(2)}M`}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Employees" secondary={mockAccount.employees} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Website" secondary={mockAccount.website} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Address" secondary={mockAccount.address} />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Description"
                secondary={mockAccount.description}
                secondaryTypographyProps={{ style: { whiteSpace: 'pre-wrap' } }}
              />
            </ListItem>
          </List>
        </TabPanel>

        {/* Activities Tab */}
        <TabPanel value={tabValue} index={1}>
          <List>
            {mockAccount.recentActivities.map((activity, index) => (
              <ListItem key={index} divider={index < mockAccount.recentActivities.length - 1}>
                <ListItemText
                  primary={activity.type}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="textSecondary">
                        {activity.date}
                      </Typography>
                      <br />
                      {activity.description}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>

        {/* Contacts Tab */}
        <TabPanel value={tabValue} index={2}>
          <List>
            {mockAccount.contacts.map((contact, index) => (
              <ListItem key={index} divider={index < mockAccount.contacts.length - 1}>
                <ListItemText
                  primary={contact.name}
                  secondary={
                    <>
                      <Typography component="span" variant="body2">
                        {contact.title}
                      </Typography>
                      <br />
                      {contact.email}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </TabPanel>

        {/* Stakeholder Map Tab */}
        <TabPanel value={tabValue} index={3}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            {/* Contact List for Drag and Drop */}
            <Paper sx={{ width: 300, p: 2, alignSelf: 'flex-start' }}>
              <Typography variant="h6" gutterBottom>
                Available Contacts
              </Typography>
              <List>
                {mockAccount.contacts.map((contact) => (
                  <Card
                    key={contact.id}
                    sx={{ mb: 1, cursor: 'move' }}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData('application/json', JSON.stringify(contact));
                    }}
                  >
                    <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DragIcon color="action" />
                        <Box>
                          <Typography variant="body1">{contact.name}</Typography>
                          <Typography variant="body2" color="textSecondary">
                            {contact.title}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </List>
            </Paper>
            
            {/* Stakeholder Map */}
            <Box sx={{ flexGrow: 1 }}>
              <StakeholderMap contacts={mockAccount.contacts} />
            </Box>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
};

export default AccountDetails; 