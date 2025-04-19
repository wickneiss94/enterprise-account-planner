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
import ContactList from '../components/ContactList';
import ContactDialog from '../components/ContactDialog';
import OpportunityBoard from '../components/OpportunityBoard';
import OpportunityDialog from '../components/OpportunityDialog';
import { useContactOpportunity } from '../contexts/ContactOpportunityContext';
import { ContactPerson } from '../models/ContactPerson';
import { Opportunity } from '../models/Opportunity';

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

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`account-detail-tabpanel-${index}`}
      aria-labelledby={`account-detail-tab-${index}`}
      sx={{ mt: 2 }}
    >
      {value === index && children}
    </Box>
  );
};

const AccountDetails: React.FC = () => {
  const {
    contacts,
    opportunities,
    addContact,
    updateContact,
    deleteContact,
    addOpportunity,
    updateOpportunity,
    deleteOpportunity,
  } = useContactOpportunity();

  const { id } = useParams<{ id: string }>();
  const [currentTab, setCurrentTab] = useState(0);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<ContactPerson | undefined>();
  const [opportunityDialogOpen, setOpportunityDialogOpen] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<Opportunity | undefined>();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  // Contact handlers
  const handleAddContact = () => {
    setSelectedContact(undefined);
    setContactDialogOpen(true);
  };

  const handleEditContact = (contact: ContactPerson) => {
    setSelectedContact(contact);
    setContactDialogOpen(true);
  };

  const handleContactSave = (contactData: Omit<ContactPerson, 'id'>) => {
    if (selectedContact) {
      updateContact(selectedContact.id, contactData);
    } else {
      addContact(contactData);
    }
    setContactDialogOpen(false);
    setSelectedContact(undefined);
  };

  // Opportunity handlers
  const handleAddOpportunity = () => {
    setSelectedOpportunity(undefined);
    setOpportunityDialogOpen(true);
  };

  const handleEditOpportunity = (opportunity: Opportunity) => {
    setSelectedOpportunity(opportunity);
    setOpportunityDialogOpen(true);
  };

  const handleOpportunitySave = (opportunityData: Omit<Opportunity, 'id' | 'lastUpdated'>) => {
    if (selectedOpportunity) {
      updateOpportunity(selectedOpportunity.id, opportunityData);
    } else {
      addOpportunity(opportunityData);
    }
    setOpportunityDialogOpen(false);
    setSelectedOpportunity(undefined);
  };

  const handleStageChange = (opportunityId: string, newStage: Opportunity['stage']) => {
    updateOpportunity(opportunityId, { stage: newStage });
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Account Details
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Paper sx={{ width: '100%' }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Contacts" />
          <Tab label="Opportunities" />
        </Tabs>

        <Box sx={{ p: 2 }}>
          <TabPanel value={currentTab} index={0}>
            <ContactList
              contacts={contacts}
              onAddContact={handleAddContact}
              onEditContact={handleEditContact}
              onDeleteContact={deleteContact}
            />
          </TabPanel>

          <TabPanel value={currentTab} index={1}>
            <OpportunityBoard
              opportunities={opportunities}
              onAddOpportunity={handleAddOpportunity}
              onEditOpportunity={handleEditOpportunity}
              onStageChange={handleStageChange}
            />
          </TabPanel>
        </Box>
      </Paper>

      <ContactDialog
        open={contactDialogOpen}
        onClose={() => setContactDialogOpen(false)}
        onSave={handleContactSave}
        contact={selectedContact}
        mode={selectedContact ? 'edit' : 'add'}
      />

      <OpportunityDialog
        open={opportunityDialogOpen}
        onClose={() => setOpportunityDialogOpen(false)}
        onSave={handleOpportunitySave}
        opportunity={selectedOpportunity}
        mode={selectedOpportunity ? 'edit' : 'add'}
      />
    </Box>
  );
};

export default AccountDetails; 