import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  SelectChangeEvent,
} from '@mui/material';
import { Account, AccountStatus, AccountPriority } from '../../models/Account';
import { useAccounts } from '../../contexts/AccountContext';

interface AccountFormProps {
  open: boolean;
  onClose: () => void;
  account?: Account;
}

type AccountFormData = Omit<Account, 'id' | 'lastUpdated' | 'createdAt' | 'updatedAt'> & {
  lastUpdated?: Date;
};

const initialFormState: AccountFormData = {
  name: '',
  ticker: '',
  industry: '',
  arr: 0,
  status: 'Prospect' as AccountStatus,
  priority: 'Medium' as AccountPriority,
  transformationReadiness: false,
  notes: '',
  contacts: [],
  opportunities: [],
  expectedCloseDate: undefined,
};

const AccountForm: React.FC<AccountFormProps> = ({ open, onClose, account }) => {
  const [formData, setFormData] = useState<AccountFormData>(initialFormState);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { addAccount, updateAccount } = useAccounts();

  useEffect(() => {
    if (account) {
      setFormData({
        name: account.name,
        ticker: account.ticker || '',
        industry: account.industry,
        arr: account.arr,
        status: account.status,
        priority: account.priority,
        transformationReadiness: account.transformationReadiness,
        notes: account.notes || '',
        contacts: account.contacts || [],
        opportunities: account.opportunities || [],
        expectedCloseDate: account.expectedCloseDate,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [account]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const now = new Date();
      const submitData = {
        ...formData,
        lastUpdated: now,
        createdAt: account ? account.createdAt : now,
        updatedAt: now,
      };

      if (account) {
        await updateAccount(account.id, submitData);
      } else {
        await addAccount(submitData);
      }
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save account');
    } finally {
      setLoading(false);
    }
  };

  const handleTextChange = (field: keyof AccountFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSelectChange = (field: 'status' | 'priority') => (
    e: SelectChangeEvent
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSwitchChange = (field: keyof AccountFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.checked }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {account ? 'Edit Account' : 'Create New Account'}
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <TextField
            fullWidth
            required
            label="Account Name"
            value={formData.name}
            onChange={handleTextChange('name')}
            margin="normal"
          />
          
          <TextField
            fullWidth
            label="Ticker Symbol"
            value={formData.ticker}
            onChange={handleTextChange('ticker')}
            margin="normal"
          />
          
          <TextField
            fullWidth
            required
            label="Industry"
            value={formData.industry}
            onChange={handleTextChange('industry')}
            margin="normal"
          />
          
          <TextField
            fullWidth
            required
            type="number"
            label="Annual Recurring Revenue"
            value={formData.arr}
            onChange={handleTextChange('arr')}
            margin="normal"
            InputProps={{
              startAdornment: <Typography>$</Typography>
            }}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              onChange={handleSelectChange('status')}
              label="Status"
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Prospect">Prospect</MenuItem>
              <MenuItem value="At Risk">At Risk</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Priority</InputLabel>
            <Select
              value={formData.priority}
              onChange={handleSelectChange('priority')}
              label="Priority"
            >
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
          
          <FormControlLabel
            control={
              <Switch
                checked={formData.transformationReadiness}
                onChange={handleSwitchChange('transformationReadiness')}
              />
            }
            label="Transformation Readiness"
            sx={{ mt: 1 }}
          />
          
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Notes"
            value={formData.notes}
            onChange={handleTextChange('notes')}
            margin="normal"
          />

          {formData.expectedCloseDate && (
            <TextField
              fullWidth
              type="date"
              label="Expected Close Date"
              value={formData.expectedCloseDate.toISOString().split('T')[0]}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  expectedCloseDate: e.target.value ? new Date(e.target.value) : undefined,
                }));
              }}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Saving...' : account ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AccountForm; 