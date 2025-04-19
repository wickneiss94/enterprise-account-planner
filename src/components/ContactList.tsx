import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Chip,
  Box,
  Typography,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { ContactPerson } from '../models/ContactPerson';

interface ContactListProps {
  contacts: ContactPerson[];
  onAddContact: () => void;
  onEditContact: (contact: ContactPerson) => void;
  onDeleteContact: (contactId: string) => void;
}

const getRoleColor = (role: ContactPerson['role']) => {
  const colors = {
    'Decision Maker': 'error',
    'Influencer': 'warning',
    'User': 'info',
    'Technical Contact': 'success'
  } as const;
  return colors[role];
};

const formatDate = (date: Date | undefined) => {
  if (!date) return 'Never';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const ContactList: React.FC<ContactListProps> = ({
  contacts,
  onAddContact,
  onEditContact,
  onDeleteContact,
}) => {
  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">Contacts</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddContact}
        >
          Add Contact
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Last Contact</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contacts.map((contact) => (
              <TableRow key={contact.id}>
                <TableCell>{contact.name}</TableCell>
                <TableCell>{contact.title}</TableCell>
                <TableCell>
                  <Chip
                    label={contact.role}
                    color={getRoleColor(contact.role)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </TableCell>
                <TableCell>
                  {contact.phone && (
                    <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                  )}
                </TableCell>
                <TableCell>{formatDate(contact.lastContactDate)}</TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => onEditContact(contact)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => onDeleteContact(contact.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {contacts.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography color="textSecondary">
                    No contacts added yet
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

export default ContactList; 