import React, { useState, useCallback } from 'react';
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
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  Box,
  Typography,
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

type AccountNodeData = {
  name: string;
  arr: number;
  industry: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Prospect' | 'At Risk';
};

type AccountNode = Node<AccountNodeData>;

interface TerritoryMapProps {
  accounts: Account[];
}

const getNodeStyle = (priority: 'High' | 'Medium' | 'Low', status: 'Active' | 'Prospect' | 'At Risk') => {
  const baseStyle = {
    padding: 15,
    borderRadius: 8,
    border: '1px solid #ccc',
    width: 220,
  };

  // Priority affects the border width and style
  const priorityStyles = {
    High: { borderWidth: 3, boxShadow: '0 4px 8px rgba(0,0,0,0.2)' },
    Medium: { borderWidth: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
    Low: { borderWidth: 1 },
  };

  // Status affects the background color
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

const AccountNodeDisplay = ({ data }: { data: AccountNodeData }) => {
  const formatARR = (arr: number) => {
    return `$${(arr / 1000000).toFixed(1)}M`;
  };

  return (
    <div style={getNodeStyle(data.priority, data.status)}>
      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
        {data.name}
      </Typography>
      <Typography variant="body2">
        Revenue: {formatARR(data.arr)}
      </Typography>
      <Typography variant="body2">
        Industry: {data.industry}
      </Typography>
      <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
        Priority: {data.priority} | Status: {data.status}
      </Typography>
    </div>
  );
};

const nodeTypes = {
  account: AccountNodeDisplay,
};

const TerritoryMap: React.FC<TerritoryMapProps> = ({ accounts }) => {
  const [nodes, setNodes] = useState<AccountNode[]>([]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = (event.target as Element)
        .closest('.react-flow')
        ?.getBoundingClientRect();

      if (reactFlowBounds) {
        const account = JSON.parse(event.dataTransfer.getData('application/json')) as Account;
        
        const existingNode = nodes.find(
          (node) => node.id === `account-${account.id}`
        );

        if (!existingNode) {
          const position = {
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
          };

          const newNode: AccountNode = {
            id: `account-${account.id}`,
            type: 'account',
            position,
            draggable: true,
            data: {
              name: account.name,
              arr: account.arr,
              industry: account.industry,
              priority: account.priority,
              status: account.status,
            },
          };

          setNodes((nds) => [...nds, newNode]);
        }
      }
    },
    [nodes]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

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
        onDrop={onDrop}
        onDragOver={onDragOver}
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