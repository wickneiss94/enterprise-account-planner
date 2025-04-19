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
} from '@mui/material';
import { ContactPerson } from '../models/ContactPerson';

interface ContactDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (contact: Omit<ContactPerson, 'id'>) => void;
  contact?: ContactPerson;
  mode: 'add' | 'edit';
}

const roles: ContactPerson['role'][] = [
  'Decision Maker',
  'Influencer',
  'User',
  'Technical Contact',
];

const ContactDialog: React.FC<ContactDialogProps> = ({
  open,
  onClose,
  onSave,
  contact,
  mode,
}) => {
  const [formData, setFormData] = useState<Omit<ContactPerson, 'id'>>({
    name: '',
    title: '',
    email: '',
    phone: '',
    role: 'User',
    notes: '',
    lastContactDate: new Date(),
  });

  useEffect(() => {
    if (contact) {
      const { id, ...rest } = contact;
      setFormData(rest);
    } else {
      setFormData({
        name: '',
        title: '',
        email: '',
        phone: '',
        role: 'User',
        notes: '',
        lastContactDate: new Date(),
      });
    }
  }, [contact]);

  const handleChange = (field: keyof typeof formData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleRoleChange = (event: any) => {
    setFormData((prev) => ({
      ...prev,
      role: event.target.value as ContactPerson['role'],
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
          {mode === 'add' ? 'Add New Contact' : 'Edit Contact'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={handleChange('name')}
              required
              fullWidth
            />

            <TextField
              label="Title"
              value={formData.title}
              onChange={handleChange('title')}
              required
              fullWidth
            />

            <FormControl fullWidth required>
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                onChange={handleRoleChange}
                label="Role"
              >
                {roles.map((role) => (
                  <MenuItem key={role} value={role}>
                    {role}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              required
              fullWidth
            />

            <TextField
              label="Phone"
              value={formData.phone}
              onChange={handleChange('phone')}
              fullWidth
            />

            <TextField
              label="Last Contact Date"
              type="date"
              value={formData.lastContactDate?.toISOString().split('T')[0]}
              onChange={(e) => {
                setFormData((prev) => ({
                  ...prev,
                  lastContactDate: new Date(e.target.value),
                }));
              }}
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
            />

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

export default ContactDialog; 