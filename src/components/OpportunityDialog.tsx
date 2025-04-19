import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Slider,
  Typography,
} from '@mui/material';
import { Opportunity } from '../models/Opportunity';

interface OpportunityDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (opportunity: Omit<Opportunity, 'id' | 'lastUpdated'>) => void;
  opportunity?: Opportunity;
  mode: 'add' | 'edit';
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

const initialFormData: Omit<Opportunity, 'id'> = {
  name: '',
  description: '',
  value: 0,
  stage: 'Qualification',
  status: 'Active',
  expectedCloseDate: new Date(),
  probability: 0,
  notes: '',
  accountId: '',
  contactIds: [],
  initiativeIds: [],
  products: [],
  createdAt: new Date(),
  updatedAt: new Date()
};

const OpportunityDialog: React.FC<OpportunityDialogProps> = ({
  open,
  onClose,
  onSave,
  opportunity,
  mode,
}) => {
  const [formData, setFormData] = useState<Omit<Opportunity, 'id' | 'lastUpdated'>>({
    name: '',
    description: '',
    value: 0,
    stage: 'Qualification',
    status: 'Active',
    expectedCloseDate: new Date(),
    probability: 0,
    notes: '',
    accountId: '',
    contactIds: [],
    initiativeIds: [],
    products: [],
    createdAt: new Date(),
    updatedAt: new Date()
  });

  useEffect(() => {
    if (opportunity) {
      const { id, ...rest } = opportunity;
      setFormData(rest);
    } else {
      setFormData(initialFormData);
    }
  }, [opportunity]);

  const handleChange = (field: keyof typeof formData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleStageChange = (event: any) => {
    setFormData((prev) => ({
      ...prev,
      stage: event.target.value as Opportunity['stage'],
    }));
  };

  const handleProbabilityChange = (event: Event, newValue: number | number[]) => {
    setFormData((prev) => ({
      ...prev,
      probability: newValue as number,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          {mode === 'add' ? 'Add New Opportunity' : 'Edit Opportunity'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Opportunity Name"
              value={formData.name}
              onChange={handleChange('name')}
              required
              fullWidth
            />

            <TextField
              label="Value"
              type="number"
              value={formData.value}
              onChange={handleChange('value')}
              required
              fullWidth
              InputProps={{
                startAdornment: <span>$</span>,
              }}
            />

            <FormControl fullWidth>
              <InputLabel>Stage</InputLabel>
              <Select
                value={formData.stage}
                onChange={handleStageChange}
                label="Stage"
                required
              >
                {stages.map((stage) => (
                  <MenuItem key={stage} value={stage}>
                    {stage}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Expected Close Date"
              type="date"
              value={formData.expectedCloseDate.toISOString().split('T')[0]}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  expectedCloseDate: new Date(e.target.value),
                }));
              }}
              required
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />

            <Box>
              <Typography gutterBottom>
                Probability: {formData.probability}%
              </Typography>
              <Slider
                value={formData.probability}
                onChange={handleProbabilityChange}
                valueLabelDisplay="auto"
                step={5}
                marks
                min={0}
                max={100}
              />
            </Box>

            <TextField
              label="Notes"
              value={formData.notes}
              onChange={handleChange('notes')}
              multiline
              rows={4}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {mode === 'add' ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default OpportunityDialog; 