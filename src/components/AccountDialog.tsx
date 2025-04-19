import React from 'react';
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
  FormControlLabel,
  Switch,
} from '@mui/material';

interface Account {
  id: number;
  name: string;
  ticker: string;
  arr: number;
  industry: string;
  transformationReadiness: boolean;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Prospect' | 'At Risk';
}

interface AccountDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (account: Omit<Account, 'id'>) => void;
  account?: Account;
  mode: 'add' | 'edit';
}

const industries = [
  'Technology',
  'Healthcare',
  'Financial Services',
  'Retail',
  'Manufacturing',
  'Automotive',
  'Aerospace',
  'Energy',
  'Telecommunications',
  'Other',
];

const priorities = ['High', 'Medium', 'Low'] as const;
const statuses = ['Active', 'Prospect', 'At Risk'] as const;

const AccountDialog: React.FC<AccountDialogProps> = ({ open, onClose, onSave, account, mode }) => {
  const [formData, setFormData] = React.useState<Omit<Account, 'id'>>({
    name: '',
    ticker: '',
    arr: 0,
    industry: '',
    transformationReadiness: false,
    priority: 'Medium',
    status: 'Prospect',
  });

  React.useEffect(() => {
    if (account) {
      setFormData({
        name: account.name,
        ticker: account.ticker,
        arr: account.arr,
        industry: account.industry,
        transformationReadiness: account.transformationReadiness,
        priority: account.priority,
        status: account.status,
      });
    } else {
      setFormData({
        name: '',
        ticker: '',
        arr: 0,
        industry: '',
        transformationReadiness: false,
        priority: 'Medium',
        status: 'Prospect',
      });
    }
  }, [account]);

  const handleChange = (field: keyof Omit<Account, 'id'>) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    const value = field === 'arr' ? Number(event.target.value) : event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'transformationReadiness' ? !prev.transformationReadiness : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{mode === 'add' ? 'Add New Account' : 'Edit Account'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Company Name"
            fullWidth
            required
            value={formData.name}
            onChange={handleChange('name')}
          />
          <TextField
            margin="dense"
            label="Stock Ticker"
            fullWidth
            value={formData.ticker}
            onChange={handleChange('ticker')}
            helperText="Enter 'Private' for private companies"
          />
          <TextField
            margin="dense"
            label="Annual Recurring Revenue"
            type="number"
            fullWidth
            required
            value={formData.arr}
            onChange={handleChange('arr')}
            InputProps={{
              startAdornment: '$',
            }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Industry</InputLabel>
            <Select
              value={formData.industry}
              onChange={handleChange('industry') as any}
              required
              label="Industry"
            >
              {industries.map((industry) => (
                <MenuItem key={industry} value={industry}>
                  {industry}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Priority</InputLabel>
            <Select
              value={formData.priority}
              onChange={handleChange('priority') as any}
              required
              label="Priority"
            >
              {priorities.map((priority) => (
                <MenuItem key={priority} value={priority}>
                  {priority}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              onChange={handleChange('status') as any}
              required
              label="Status"
            >
              {statuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={formData.transformationReadiness}
                onChange={handleChange('transformationReadiness')}
              />
            }
            label="Transformation Readiness"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {mode === 'add' ? 'Add' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AccountDialog; 