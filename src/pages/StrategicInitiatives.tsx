import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Chip,
  LinearProgress,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Flag as FlagIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';

// Mock data - replace with actual data from your backend
const mockInitiatives = [
  {
    id: 1,
    name: 'Digital Transformation Program',
    description: 'Comprehensive digital transformation across all business units',
    status: 'In Progress',
    priority: 'High',
    progress: 65,
    dueDate: '2024-12-31',
    owner: 'John Smith',
    keyMilestones: [
      { name: 'Requirements Gathering', status: 'Completed' },
      { name: 'Solution Design', status: 'In Progress' },
      { name: 'Implementation', status: 'Not Started' },
    ],
  },
  {
    id: 2,
    name: 'Security Enhancement Project',
    description: 'Upgrade security infrastructure and implement new protocols',
    status: 'Not Started',
    priority: 'High',
    progress: 0,
    dueDate: '2024-09-30',
    owner: 'Sarah Johnson',
    keyMilestones: [
      { name: 'Security Audit', status: 'Not Started' },
      { name: 'Implementation Plan', status: 'Not Started' },
      { name: 'Staff Training', status: 'Not Started' },
    ],
  },
  {
    id: 3,
    name: 'Cloud Migration Phase 2',
    description: 'Migration of remaining on-premise applications to cloud',
    status: 'On Hold',
    priority: 'Medium',
    progress: 30,
    dueDate: '2024-10-15',
    owner: 'Mike Chen',
    keyMilestones: [
      { name: 'Application Assessment', status: 'Completed' },
      { name: 'Migration Planning', status: 'On Hold' },
      { name: 'Data Migration', status: 'Not Started' },
    ],
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Completed':
      return 'success';
    case 'In Progress':
      return 'primary';
    case 'On Hold':
      return 'warning';
    case 'Not Started':
      return 'default';
    default:
      return 'default';
  }
};

const getPriorityIcon = (priority: string) => {
  switch (priority) {
    case 'High':
      return <FlagIcon color="error" />;
    case 'Medium':
      return <FlagIcon color="warning" />;
    case 'Low':
      return <FlagIcon color="info" />;
    default:
      return <FlagIcon />;
  }
};

const StrategicInitiatives = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Strategic Initiatives</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Add Initiative
        </Button>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography color="textSecondary" gutterBottom>
            Total Initiatives
          </Typography>
          <Typography variant="h4">{mockInitiatives.length}</Typography>
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="textSecondary">
              {mockInitiatives.filter((i) => i.status === 'In Progress').length} In Progress
            </Typography>
          </Box>
        </Paper>

        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography color="textSecondary" gutterBottom>
            High Priority Initiatives
          </Typography>
          <Typography variant="h4">
            {mockInitiatives.filter((i) => i.priority === 'High').length}
          </Typography>
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="error">
              Requires immediate attention
            </Typography>
          </Box>
        </Paper>

        <Paper sx={{ p: 2, flex: 1 }}>
          <Typography color="textSecondary" gutterBottom>
            Overall Progress
          </Typography>
          <Typography variant="h4">
            {Math.round(
              mockInitiatives.reduce((sum, init) => sum + init.progress, 0) / mockInitiatives.length
            )}
            %
          </Typography>
          <LinearProgress
            variant="determinate"
            value={
              mockInitiatives.reduce((sum, init) => sum + init.progress, 0) / mockInitiatives.length
            }
            sx={{ mt: 1 }}
          />
        </Paper>
      </Box>

      {/* Initiatives List */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {mockInitiatives.map((initiative) => (
          <Card key={initiative.id}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h5" gutterBottom>
                    {initiative.name}
                  </Typography>
                  <Typography color="textSecondary" sx={{ mb: 2 }}>
                    {initiative.description}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                  <Tooltip title={`Priority: ${initiative.priority}`}>
                    {getPriorityIcon(initiative.priority)}
                  </Tooltip>
                  <Chip
                    label={initiative.status}
                    color={getStatusColor(initiative.status) as any}
                    size="small"
                  />
                </Box>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Progress
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={initiative.progress}
                  sx={{ mb: 1, height: 8, borderRadius: 4 }}
                />
                <Typography variant="body2" color="textSecondary">
                  Due Date: {initiative.dueDate} | Owner: {initiative.owner}
                </Typography>
              </Box>

              <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Key Milestones
                </Typography>
                {initiative.keyMilestones.map((milestone, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    {milestone.status === 'Completed' ? (
                      <CheckCircleIcon color="success" fontSize="small" />
                    ) : milestone.status === 'In Progress' ? (
                      <WarningIcon color="warning" fontSize="small" />
                    ) : (
                      <FlagIcon color="disabled" fontSize="small" />
                    )}
                    <Typography variant="body2">
                      {milestone.name} - {milestone.status}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
            <CardActions>
              <Button size="small" startIcon={<EditIcon />}>
                Edit
              </Button>
              <Button size="small" color="error" startIcon={<DeleteIcon />}>
                Delete
              </Button>
            </CardActions>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default StrategicInitiatives; 