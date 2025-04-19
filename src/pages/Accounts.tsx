import React, { useState } from 'react';
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

// Updated mock data with priority and status
const mockAccounts: Account[] = [
  {
    id: 1,
    name: 'Microsoft Corporation',
    ticker: 'MSFT',
    arr: 50000000,
    industry: 'Technology',
    transformationReadiness: true,
    priority: 'High' as const,
    status: 'Active' as const,
  },
  {
    id: 2,
    name: 'Tesla, Inc.',
    ticker: 'TSLA',
    arr: 25000000,
    industry: 'Automotive',
    transformationReadiness: true,
    priority: 'Medium' as const,
    status: 'Active' as const,
  },
  {
    id: 3,
    name: 'Johnson & Johnson',
    ticker: 'JNJ',
    arr: 35000000,
    industry: 'Healthcare',
    transformationReadiness: false,
    priority: 'Low' as const,
    status: 'At Risk' as const,
  },
  {
    id: 4,
    name: 'Walmart Inc.',
    ticker: 'WMT',
    arr: 45000000,
    industry: 'Retail',
    transformationReadiness: true,
    priority: 'High' as const,
    status: 'Active' as const,
  },
  {
    id: 5,
    name: 'SpaceX',
    ticker: 'Private',
    arr: 15000000,
    industry: 'Aerospace',
    transformationReadiness: true,
    priority: 'Medium' as const,
    status: 'Prospect' as const,
  },
];

const Accounts = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>(undefined);
  const [dialogMode, setDialogMode] = useState<'add' | 'edit'>('add');
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleReadinessToggle = (id: number) => {
    setAccounts(accounts.map(account => 
      account.id === id 
        ? { ...account, transformationReadiness: !account.transformationReadiness }
        : account
    ));
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

  const handleDialogSave = (accountData: Omit<Account, 'id'>) => {
    if (dialogMode === 'add') {
      const newAccount = {
        ...accountData,
        id: Math.max(...accounts.map(a => a.id)) + 1,
      };
      setAccounts([...accounts, newAccount]);
    } else {
      setAccounts(accounts.map(account =>
        account.id === selectedAccount?.id
          ? { ...account, ...accountData }
          : account
      ));
    }
    handleDialogClose();
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
                        handleReadinessToggle(account.id);
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
          onSave={handleDialogSave}
          account={selectedAccount}
          mode={dialogMode}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">Territory Map</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Paper sx={{ p: 2, flex: '0 0 250px' }}>
            <Typography variant="h6" gutterBottom>
              Accounts
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 1,
              maxHeight: 'calc(70vh - 100px)',
              overflowY: 'auto'
            }}>
              {accounts.map((account) => (
                <Paper
                  key={account.id}
                  elevation={2}
                  sx={{ 
                    p: 1,
                    cursor: 'move',
                    '&:hover': { backgroundColor: '#f5f5f5' }
                  }}
                  draggable
                  onDragStart={(e) => {
                    e.dataTransfer.setData('application/json', JSON.stringify(account));
                  }}
                >
                  <Typography variant="subtitle2">{account.name}</Typography>
                  <Typography variant="caption" display="block">
                    {account.industry} | {formatARR(account.arr)}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Paper>
          <Box sx={{ flex: 1 }}>
            <TerritoryMap accounts={accounts} />
          </Box>
        </Box>
      </TabPanel>
    </Box>
  );
};

export default Accounts; 