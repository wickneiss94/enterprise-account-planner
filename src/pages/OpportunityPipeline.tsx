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
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';

// Mock data - replace with actual data from your backend
const mockOpportunities = [
  {
    id: 1,
    name: 'Enterprise Cloud Migration',
    value: 500000,
    stage: 'Qualification',
    probability: 60,
    expectedCloseDate: '2024-06-30',
    owner: 'Jane Smith',
    description: 'Migration of on-premise infrastructure to cloud',
    nextSteps: 'Technical architecture review',
  },
  {
    id: 2,
    name: 'Security Suite Upgrade',
    value: 250000,
    stage: 'Proposal',
    probability: 75,
    expectedCloseDate: '2024-05-15',
    owner: 'Mike Johnson',
    description: 'Comprehensive security solution upgrade',
    nextSteps: 'Final proposal presentation',
  },
  {
    id: 3,
    name: 'Data Analytics Platform',
    value: 750000,
    stage: 'Negotiation',
    probability: 90,
    expectedCloseDate: '2024-04-30',
    owner: 'Sarah Wilson',
    description: 'Implementation of advanced analytics solution',
    nextSteps: 'Contract review with legal',
  },
];

const stages = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];

const getStageColor = (stage: string) => {
  switch (stage) {
    case 'Prospecting':
      return '#e3f2fd';
    case 'Qualification':
      return '#e8f5e9';
    case 'Proposal':
      return '#fff3e0';
    case 'Negotiation':
      return '#fce4ec';
    case 'Closed Won':
      return '#e8f5e9';
    case 'Closed Lost':
      return '#ffebee';
    default:
      return '#f5f5f5';
  }
};

const OpportunityPipeline = () => {
  const { id } = useParams<{ id: string }>();

  const totalValue = mockOpportunities.reduce((sum, opp) => sum + opp.value, 0);
  const weightedValue = mockOpportunities.reduce(
    (sum, opp) => sum + opp.value * (opp.probability / 100),
    0
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Opportunity Pipeline</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Add Opportunity
        </Button>
      </Box>

      {/* Pipeline Summary */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 4 }}>
          <Box>
            <Typography color="textSecondary" gutterBottom>
              Total Pipeline Value
            </Typography>
            <Typography variant="h4">${(totalValue / 1000000).toFixed(2)}M</Typography>
          </Box>
          <Box>
            <Typography color="textSecondary" gutterBottom>
              Weighted Pipeline Value
            </Typography>
            <Typography variant="h4">${(weightedValue / 1000000).toFixed(2)}M</Typography>
          </Box>
          <Box>
            <Typography color="textSecondary" gutterBottom>
              Active Opportunities
            </Typography>
            <Typography variant="h4">{mockOpportunities.length}</Typography>
          </Box>
        </Box>
      </Paper>

      {/* Pipeline Stages */}
      <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
        {stages.map((stage) => (
          <Box
            key={stage}
            sx={{
              minWidth: 300,
              maxWidth: 300,
              flexShrink: 0,
            }}
          >
            <Paper
              sx={{
                p: 2,
                backgroundColor: getStageColor(stage),
                height: '100%',
              }}
            >
              <Typography variant="h6" gutterBottom>
                {stage}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {mockOpportunities
                  .filter((opp) => opp.stage === stage)
                  .map((opportunity) => (
                    <Card key={opportunity.id} variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {opportunity.name}
                        </Typography>
                        <Typography color="textSecondary" gutterBottom>
                          ${(opportunity.value / 1000).toFixed(0)}K
                        </Typography>
                        <Box sx={{ mt: 1, mb: 1 }}>
                          <Typography variant="body2" color="textSecondary">
                            Probability: {opportunity.probability}%
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={opportunity.probability}
                            sx={{ mt: 1 }}
                          />
                        </Box>
                        <Typography variant="body2">
                          Close Date: {opportunity.expectedCloseDate}
                        </Typography>
                      </CardContent>
                      <Divider />
                      <CardActions>
                        <Tooltip title="Move Back">
                          <IconButton size="small">
                            <ArrowBackIcon />
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
                        <Tooltip title="Move Forward">
                          <IconButton size="small">
                            <ArrowForwardIcon />
                          </IconButton>
                        </Tooltip>
                      </CardActions>
                    </Card>
                  ))}
              </Box>
            </Paper>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default OpportunityPipeline; 