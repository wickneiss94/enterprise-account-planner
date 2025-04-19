import React, { useState, useEffect } from 'react';
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
  Switch,
  Button,
  Chip,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AccountDialog from '../components/AccountDialog';
import TerritoryMap from '../components/TerritoryMap';
import { useAccounts } from '../contexts/AccountContext';
import { Account, getAccounts, createAccount, updateAccount, deleteAccount } from '../models/Account';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`account-tabpanel-${index}`}
      aria-labelledby={`account-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const Accounts = () => {
  const navigate = useNavigate();
  const { accounts, addAccount, updateAccount } = useAccounts();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>(undefined);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleReadinessToggle = async (accountId: string, currentReadiness: boolean) => {
    try {
      await updateAccount(accountId, {
        transformationReadiness: !currentReadiness,
        lastUpdated: new Date()
      });
    } catch (error) {
      console.error('Error updating account readiness:', error);
    }
  };

  const handleAddClick = () => {
    setDialogMode('add');
    setSelectedAccount(undefined);
    setDialogOpen(true);
  };

  const handleEditClick = (event: React.MouseEvent, account: Account) => {
    event.stopPropagation();
    setDialogMode('edit');
    setSelectedAccount(account);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedAccount(undefined);
  };

  const handleDialogSave = async (accountData: Omit<Account, 'id' | 'lastUpdated'>) => {
    try {
      if (selectedAccount) {
        // Update existing account
        await updateAccount(selectedAccount.id, {
          ...accountData,
          lastUpdated: new Date()
        });
      } else {
        // Create new account
        const newAccountId = await createAccount({
          ...accountData,
          lastUpdated: new Date()
        });
        const newAccount: Account = {
          ...accountData,
          id: newAccountId,
          lastUpdated: new Date()
        };
      }
      handleDialogClose();
    } catch (error) {
      console.error('Error saving account:', error);
    }
  };

  const formatARR = (arr: number) => {
    return `$${(arr / 1000000).toFixed(1)}M`;
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Account List" />
          <Tab label="Territory Map" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Enterprise Accounts</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAddClick}>
            Add Account
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Company Name</TableCell>
                <TableCell>Stock Ticker</TableCell>
                <TableCell>Annual Recurring Revenue</TableCell>
                <TableCell>Industry</TableCell>
                <TableCell>Transformation Readiness</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accounts.map((account) => (
                <TableRow
                  key={account.id}
                  hover
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/accounts/${account.id}`)}
                >
                  <TableCell>{account.name}</TableCell>
                  <TableCell>
                    {account.ticker === 'Private' ? (
                      <Chip label="Private" size="small" />
                    ) : (
                      account.ticker
                    )}
                  </TableCell>
                  <TableCell>{formatARR(account.arr)}</TableCell>
                  <TableCell>{account.industry}</TableCell>
                  <TableCell>
                    <Switch
                      checked={account.transformationReadiness}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleReadinessToggle(account.id, account.transformationReadiness);
                      }}
                      color="primary"
                    />
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit Account">
                      <IconButton
                        size="small"
                        onClick={(e) => handleEditClick(e, account)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <AccountDialog
          open={dialogOpen}
          onClose={handleDialogClose}
          onSave={(account) => {
            const accountData = {
              ...account,
              createdAt: selectedAccount?.createdAt || new Date().toISOString(),
              updatedAt: new Date().toISOString()
            };
            return handleDialogSave(accountData);
          }}
          account={selectedAccount as Account}
          mode={dialogMode}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', gap: 2, height: 'calc(100vh - 200px)' }}>
          <Paper sx={{ p: 2, width: 300 }}>
            <Typography variant="h6" gutterBottom>
              Territory Overview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Drag accounts from the list to position them on the map.
              The size and color of each node represents the account's
              priority and status.
            </Typography>
          </Paper>
          <Box sx={{ flex: 1 }}>
            <TerritoryMap />
          </Box>
        </Box>
      </TabPanel>
    </Box>
  );
};

export default Accounts; 