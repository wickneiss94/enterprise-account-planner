import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  DragIndicator as DragIndicatorIcon,
} from '@mui/icons-material';
import { Opportunity } from '../models/Opportunity';

interface OpportunityBoardProps {
  opportunities: Opportunity[];
  onAddOpportunity: () => void;
  onEditOpportunity: (opportunity: Opportunity) => void;
  onStageChange: (opportunityId: string, newStage: Opportunity['stage']) => void;
}

const stages: Opportunity['stage'][] = [
  'Qualification',
  'Discovery',
  'Solution Development',
  'Proposal',
  'Negotiation',
  'Closed Won',
  'Closed Lost'
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const OpportunityBoard: React.FC<OpportunityBoardProps> = ({
  opportunities,
  onAddOpportunity,
  onEditOpportunity,
  onStageChange,
}) => {
  const getOpportunitiesByStage = (stage: Opportunity['stage']) => {
    return opportunities.filter(opp => opp.stage === stage);
  };

  const handleDragStart = (event: React.DragEvent, opportunityId: string) => {
    event.dataTransfer.setData('text/plain', opportunityId);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent, newStage: Opportunity['stage']) => {
    event.preventDefault();
    const opportunityId = event.dataTransfer.getData('text/plain');
    onStageChange(opportunityId, newStage);
  };

  return (
    <Box sx={{ height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Opportunities</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddOpportunity}
        >
          Add Opportunity
        </Button>
      </Box>

      <Box
        sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          pb: 2,
          '& > *': { minWidth: 300 },
        }}
      >
        {stages.map((stage) => (
          <Paper
            key={stage}
            sx={{
              p: 2,
              backgroundColor: theme => 
                stage === 'Closed Won' ? theme.palette.success.light :
                stage === 'Closed Lost' ? theme.palette.error.light :
                theme.palette.background.default,
            }}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, stage)}
          >
            <Typography variant="subtitle1" gutterBottom>
              {stage}
            </Typography>
            <Box sx={{ minHeight: 100 }}>
              {getOpportunitiesByStage(stage).map((opportunity) => (
                <Card
                  key={opportunity.id}
                  sx={{ mb: 1, cursor: 'move' }}
                  draggable
                  onDragStart={(e) => handleDragStart(e, opportunity.id)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DragIndicatorIcon
                          fontSize="small"
                          sx={{ color: 'text.secondary', cursor: 'grab' }}
                        />
                        <Typography variant="subtitle2">
                          {opportunity.name}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={() => onEditOpportunity(opportunity)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Value: {formatCurrency(opportunity.value)}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={`${opportunity.probability}% Probability`}
                        size="small"
                        color={
                          opportunity.probability >= 75 ? 'success' :
                          opportunity.probability >= 50 ? 'warning' :
                          'error'
                        }
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default OpportunityBoard; 