import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  Connection,
  EdgeChange,
  NodeChange,
  applyNodeChanges,
  addEdge,
  NodeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { useAccounts } from '../contexts/AccountContext';
import { Account } from '../models/Account';
import { ContactPerson } from '../models/ContactPerson';
import { Opportunity } from '../models/Opportunity';

interface AccountNodeData {
  id: string;
  name: string;
  ticker?: string;
  industry: string;
  arr: number;
  status: Account['status'];
  priority: Account['priority'];
  transformationReadiness?: number;
  lastUpdated: Date;
  notes?: string;
  contacts?: ContactPerson[];
  opportunities?: Opportunity[];
}

type AccountNode = Node<AccountNodeData>;

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const getNodeStyle = (priority: Account['priority'], status: Account['status']) => {
  const baseStyle = {
    padding: 15,
    borderRadius: 8,
    border: '1px solid #ccc',
    width: 220,
  };

  const priorityStyles = {
    High: { borderWidth: 3, boxShadow: '0 4px 8px rgba(0,0,0,0.2)' },
    Medium: { borderWidth: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    Low: { borderWidth: 1 },
  };

  const statusColors = {
    Active: '#4caf50',
    Prospect: '#2196f3',
    'At Risk': '#f44336',
  };

  return {
    ...baseStyle,
    ...priorityStyles[priority],
    backgroundColor: statusColors[status],
    color: '#fff',
  };
};

const AccountNodeDisplay: React.FC<NodeProps<AccountNodeData>> = ({ data }) => {
  return (
    <div className="account-node">
      <Typography variant="h6">{data.name}</Typography>
      <Typography variant="body2">Status: {data.status}</Typography>
      <Typography variant="body2">ARR: ${data.arr.toLocaleString()}</Typography>
      <Typography variant="body2">Industry: {data.industry}</Typography>
      <Typography variant="body2">Priority: {data.priority}</Typography>
      <Typography variant="body2">Last Updated: {formatDate(new Date(data.lastUpdated))}</Typography>
      {data.opportunities && data.opportunities.length > 0 && (
        <Typography variant="body2">
          Next Close: {formatDate(new Date(data.opportunities[0].expectedCloseDate))}
        </Typography>
      )}
    </div>
  );
};

const nodeTypes = {
  account: AccountNodeDisplay,
};

const TerritoryMap: React.FC = () => {
  const [nodes, setNodes] = useState<AccountNode[]>([]);
  const { accounts, loading, error } = useAccounts();

  useEffect(() => {
    // Convert accounts to nodes with initial positions
    const accountNodes: AccountNode[] = accounts.map((account, index) => ({
      id: `account-${account.id}`,
      type: 'account',
      position: {
        x: 100 + (index % 3) * 300,
        y: 100 + Math.floor(index / 3) * 200,
      },
      draggable: true,
      data: {
        id: account.id.toString(),
        name: account.name,
        ticker: account.ticker,
        industry: account.industry,
        arr: account.arr,
        status: account.status,
        priority: account.priority,
        transformationReadiness: typeof account.transformationReadiness === 'number' ? account.transformationReadiness : undefined,
        lastUpdated: new Date(account.lastUpdated),
        notes: account.notes,
        contacts: account.contacts,
        opportunities: account.opportunities,
      },
    }));
    setNodes(accountNodes);
  }, [accounts]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error">Error: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '70vh',
        border: '1px solid #ccc',
        borderRadius: 2,
        '& .react-flow': { background: '#f8f8f8' },
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={[]}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
    </Box>
  );
};

export default TerritoryMap; 