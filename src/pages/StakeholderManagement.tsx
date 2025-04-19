import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';

// Mock data - replace with actual data from your backend
const mockStakeholders = [
  {
    id: 1,
    name: 'John Smith',
    title: 'Chief Technology Officer',
    email: 'john.smith@acmecorp.com',
    phone: '+1 (555) 123-4567',
    influence: 'High',
    relationship: 'Champion',
    lastContact: '2024-04-15',
    notes: 'Key decision maker for technical solutions',
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    title: 'Procurement Manager',
    email: 'sarah.j@acmecorp.com',
    phone: '+1 (555) 234-5678',
    influence: 'Medium',
    relationship: 'Neutral',
    lastContact: '2024-04-10',
    notes: 'Handles all vendor contracts and negotiations',
  },
  {
    id: 3,
    name: 'Michael Chen',
    title: 'IT Director',
    email: 'michael.c@acmecorp.com',
    phone: '+1 (555) 345-6789',
    influence: 'High',
    relationship: 'Supporter',
    lastContact: '2024-04-08',
    notes: 'Technical evaluator for solutions',
  },
];

const getRelationshipColor = (relationship: string) => {
  switch (relationship) {
    case 'Champion':
      return 'success';
    case 'Supporter':
      return 'info';
    case 'Neutral':
      return 'warning';
    case 'Blocker':
      return 'error';
    default:
      return 'default';
  }
};

const getInfluenceColor = (influence: string) => {
  switch (influence) {
    case 'High':
      return 'error';
    case 'Medium':
      return 'warning';
    case 'Low':
      return 'info';
    default:
      return 'default';
  }
};

const StakeholderManagement = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Stakeholder Management</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Add Stakeholder
        </Button>
      </Box>

      {/* Stakeholders Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Influence</TableCell>
              <TableCell>Relationship</TableCell>
              <TableCell>Last Contact</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockStakeholders.map((stakeholder) => (
              <TableRow key={stakeholder.id}>
                <TableCell>{stakeholder.name}</TableCell>
                <TableCell>{stakeholder.title}</TableCell>
                <TableCell>
                  <Box>
                    {stakeholder.email}
                    <br />
                    {stakeholder.phone}
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={stakeholder.influence}
                    color={getInfluenceColor(stakeholder.influence) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={stakeholder.relationship}
                    color={getRelationshipColor(stakeholder.relationship) as any}
                    size="small"
                  />
                </TableCell>
                <TableCell>{stakeholder.lastContact}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Send Email">
                      <IconButton size="small">
                        <EmailIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Edit">
                      <IconButton size="small">
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Notes Section */}
      <Paper sx={{ mt: 3, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Stakeholder Map Notes
        </Typography>
        <Typography variant="body2" color="textSecondary">
          • Champions (2): Strong advocates for our solutions, maintain regular contact
          <br />
          • Supporters (1): Positive but need more engagement
          <br />
          • Neutral (1): Focus on demonstrating value and building relationships
          <br />• Key Decision Makers: John Smith (CTO) and Michael Chen (IT Director)
        </Typography>
      </Paper>
    </Box>
  );
};

export default StakeholderManagement; 