import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Button,
  Chip,
  LinearProgress,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  People as PeopleIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { Initiative, BusinessOutcome } from '../models/Initiative';

interface InitiativeListProps {
  initiatives: Initiative[];
  onAddInitiative: () => void;
  onEditInitiative: (initiative: Initiative) => void;
  onDeleteInitiative: (id: string) => void;
  onManageContacts: (initiative: Initiative) => void;
  onManageOpportunities: (initiative: Initiative) => void;
}

const getBusinessOutcomeColor = (outcome: BusinessOutcome) => {
  const colors = {
    'Increase Revenue': 'success',
    'Cut Costs': 'warning',
    'Manage Risk': 'error',
  } as const;
  return colors[outcome];
};

const getStatusColor = (status: Initiative['status']) => {
  const colors = {
    'Not Started': 'default',
    'In Progress': 'primary',
    'Completed': 'success',
    'On Hold': 'warning',
  } as const;
  return colors[status];
};

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatCurrency = (value: number | undefined) => {
  if (!value) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const InitiativeList: React.FC<InitiativeListProps> = ({
  initiatives,
  onAddInitiative,
  onEditInitiative,
  onDeleteInitiative,
  onManageContacts,
  onManageOpportunities,
}) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Strategic Initiatives</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddInitiative}
        >
          Add Initiative
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Business Outcome</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Progress</TableCell>
              <TableCell>Timeline</TableCell>
              <TableCell>Budget</TableCell>
              <TableCell>Contacts</TableCell>
              <TableCell>Opportunities</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {initiatives.map((initiative) => (
              <TableRow key={initiative.id}>
                <TableCell>
                  <Typography variant="subtitle2">{initiative.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {initiative.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={initiative.businessOutcome}
                    color={getBusinessOutcomeColor(initiative.businessOutcome)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={initiative.status}
                    color={getStatusColor(initiative.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinearProgress
                      variant="determinate"
                      value={initiative.progress}
                      sx={{ flexGrow: 1 }}
                    />
                    <Typography variant="body2">
                      {initiative.progress}%
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(initiative.startDate)} - {formatDate(initiative.endDate)}
                  </Typography>
                </TableCell>
                <TableCell>
                  {formatCurrency(initiative.budget)}
                </TableCell>
                <TableCell>
                  <Tooltip title="Manage Contacts">
                    <IconButton
                      size="small"
                      onClick={() => onManageContacts(initiative)}
                      color="primary"
                    >
                      <PeopleIcon />
                      <Typography variant="caption" sx={{ ml: 0.5 }}>
                        {initiative.contactIds.length}
                      </Typography>
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Tooltip title="Manage Opportunities">
                    <IconButton
                      size="small"
                      onClick={() => onManageOpportunities(initiative)}
                      color="primary"
                    >
                      <MoneyIcon />
                      <Typography variant="caption" sx={{ ml: 0.5 }}>
                        {initiative.opportunityIds.length}
                      </Typography>
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => onEditInitiative(initiative)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => onDeleteInitiative(initiative.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
            {initiatives.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  <Typography color="textSecondary">
                    No initiatives added yet
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default InitiativeList; 