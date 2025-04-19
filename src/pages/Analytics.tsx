import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useParams } from 'react-router-dom';

// Mock data - replace with actual data from your backend
const mockAnalytics = {
  revenue: {
    current: 1500000,
    previous: 1200000,
    growth: 25,
    forecast: 1800000,
  },
  engagement: {
    meetings: 24,
    emails: 156,
    calls: 45,
    score: 85,
  },
  opportunities: {
    total: 8,
    won: 5,
    lost: 2,
    active: 1,
    winRate: 71,
  },
  stakeholders: {
    total: 12,
    champions: 3,
    supporters: 6,
    neutral: 2,
    blockers: 1,
  },
  timeline: [
    { date: '2024-04-15', event: 'Quarterly Business Review', type: 'Meeting' },
    { date: '2024-04-01', event: 'Contract Renewal', type: 'Milestone' },
    { date: '2024-03-15', event: 'Solution Implementation', type: 'Project' },
    { date: '2024-03-01', event: 'Security Assessment', type: 'Review' },
  ],
};

const Analytics = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography variant="h4" gutterBottom>
        Account Analytics
      </Typography>

      {/* Revenue Metrics */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Revenue Performance
        </Typography>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Card sx={{ flexGrow: 1 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Current Annual Revenue
              </Typography>
              <Typography variant="h4">
                ${(mockAnalytics.revenue.current / 1000000).toFixed(2)}M
              </Typography>
              <Typography
                variant="body2"
                color={mockAnalytics.revenue.growth >= 0 ? 'success.main' : 'error.main'}
              >
                {mockAnalytics.revenue.growth >= 0 ? '+' : ''}
                {mockAnalytics.revenue.growth}% YoY
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flexGrow: 1 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Forecasted Revenue
              </Typography>
              <Typography variant="h4">
                ${(mockAnalytics.revenue.forecast / 1000000).toFixed(2)}M
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Next 12 months
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Paper>

      {/* Engagement Metrics */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Engagement Analytics
        </Typography>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Card sx={{ flexGrow: 1 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Engagement Score
              </Typography>
              <Typography variant="h4">{mockAnalytics.engagement.score}/100</Typography>
              <Typography variant="body2" color="textSecondary">
                Based on interaction frequency and quality
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flexGrow: 1 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Interactions (Last 90 Days)
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText primary={`${mockAnalytics.engagement.meetings} Meetings`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={`${mockAnalytics.engagement.emails} Emails`} />
                </ListItem>
                <ListItem>
                  <ListItemText primary={`${mockAnalytics.engagement.calls} Calls`} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Box>
      </Paper>

      {/* Opportunity Metrics */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Opportunity Analytics
        </Typography>
        <Box sx={{ display: 'flex', gap: 3 }}>
          <Card sx={{ flexGrow: 1 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Win Rate
              </Typography>
              <Typography variant="h4">{mockAnalytics.opportunities.winRate}%</Typography>
              <Typography variant="body2" color="textSecondary">
                {mockAnalytics.opportunities.won} won out of{' '}
                {mockAnalytics.opportunities.won + mockAnalytics.opportunities.lost}
              </Typography>
            </CardContent>
          </Card>
          <Card sx={{ flexGrow: 1 }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Current Opportunities
              </Typography>
              <Typography variant="h4">{mockAnalytics.opportunities.active}</Typography>
              <Typography variant="body2" color="textSecondary">
                Active opportunities in pipeline
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Paper>

      {/* Timeline */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Activity Timeline
        </Typography>
        <List>
          {mockAnalytics.timeline.map((event, index) => (
            <React.Fragment key={index}>
              <ListItem>
                <ListItemText
                  primary={event.event}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="textSecondary">
                        {event.date}
                      </Typography>
                      <br />
                      <Typography component="span" variant="body2">
                        Type: {event.type}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              {index < mockAnalytics.timeline.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default Analytics; 