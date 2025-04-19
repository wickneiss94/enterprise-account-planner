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
  applyEdgeChanges,
  addEdge,
  Handle,
  Position,
  EdgeProps,
  BaseEdge,
  getStraightPath,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  Box,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material';
import {
  Edit as EditIcon,
} from '@mui/icons-material';

interface Contact {
  id: number;
  name: string;
  title: string;
  email: string;
  influence: 'High' | 'Medium' | 'Low';
  relationship: 'Champion' | 'Supporter' | 'Neutral' | 'Blocker';
}

interface StakeholderNode extends Node {
  data: {
    name: string;
    title: string;
    influence: 'High' | 'Medium' | 'Low';
    relationship: 'Champion' | 'Supporter' | 'Neutral' | 'Blocker';
  };
}

interface StakeholderMapProps {
  contacts: Contact[];
}

const relationshipTypes = [
  'Reports to',
  'Works with',
  'Influences',
  'Supports',
  'Blocks',
] as const;

type RelationshipType = typeof relationshipTypes[number];

type CustomEdgeData = {
  relationship: RelationshipType;
};

type CustomEdge = Edge<CustomEdgeData>;

const getNodeStyle = (influence: string, relationship: string) => {
  const baseStyle = {
    padding: 10,
    borderRadius: 5,
    border: '1px solid #ccc',
    width: 180,
  };

  // Influence affects the border width
  const influenceStyles = {
    High: { borderWidth: 3 },
    Medium: { borderWidth: 2 },
    Low: { borderWidth: 1 },
  };

  // Relationship affects the background color
  const relationshipColors = {
    Champion: '#4caf50',
    Supporter: '#2196f3',
    Neutral: '#ffc107',
    Blocker: '#f44336',
  };

  return {
    ...baseStyle,
    ...influenceStyles[influence as keyof typeof influenceStyles],
    backgroundColor: relationshipColors[relationship as keyof typeof relationshipColors],
    color: '#fff',
  };
};

const StakeholderNode = ({ data }: { data: StakeholderNode['data'] }) => {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div style={getNodeStyle(data.influence, data.relationship)}>
        <div style={{ fontWeight: 'bold' }}>{data.name}</div>
        <div style={{ fontSize: '0.8em' }}>{data.title}</div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
};

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  selected,
}: EdgeProps) => {
  const [edgePathString, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <BaseEdge id={id} path={edgePathString} />
      <foreignObject
        width={100}
        height={40}
        x={labelX - 50}
        y={labelY - 20}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div
          style={{
            background: selected ? '#eee' : '#fff',
            padding: '4px 8px',
            borderRadius: 4,
            fontSize: 12,
            border: '1px solid #ccc',
            textAlign: 'center',
            cursor: 'pointer',
          }}
          onClick={handleClick}
        >
          <Typography variant="caption" sx={{ display: 'block' }}>
            {data?.relationship || 'Set Type'}
          </Typography>
          <EditIcon sx={{ fontSize: 12 }} />
        </div>
      </foreignObject>
    </>
  );
};

const nodeTypes = {
  stakeholder: StakeholderNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

const StakeholderMap: React.FC<StakeholderMapProps> = ({ contacts }) => {
  const [nodes, setNodes] = useState<StakeholderNode[]>([]);
  const [edges, setEdges] = useState<CustomEdge[]>([]);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds as Node[])),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      // Only create edge if both source and target are defined
      if (connection.source && connection.target) {
        const newEdge: CustomEdge = {
          id: `edge-${connection.source}-${connection.target}`,
          source: connection.source,
          target: connection.target,
          sourceHandle: connection.sourceHandle || undefined,
          targetHandle: connection.targetHandle || undefined,
          type: 'custom',
          data: {
            relationship: 'Works with',
          },
        };
        setEdges((eds) => addEdge(newEdge, eds));
      }
    },
    []
  );

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = (event.target as Element)
        .closest('.react-flow')
        ?.getBoundingClientRect();

      if (reactFlowBounds) {
        const contact = JSON.parse(event.dataTransfer.getData('application/json')) as Contact;
        
        const existingNode = nodes.find(
          (node) => node.data.name === contact.name && node.data.title === contact.title
        );

        if (!existingNode) {
          const position = {
            x: event.clientX - reactFlowBounds.left,
            y: event.clientY - reactFlowBounds.top,
          };

          const newNode: StakeholderNode = {
            id: `stakeholder-${contact.id}`,
            type: 'stakeholder',
            position,
            data: {
              name: contact.name,
              title: contact.title,
              influence: contact.influence,
              relationship: contact.relationship,
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

  const handleEdgeClick = (event: React.MouseEvent, edge: Edge) => {
    setSelectedEdge(edge.id);
    setMenuAnchor(event.currentTarget as HTMLElement);
  };

  const handleRelationshipSelect = (relationship: RelationshipType) => {
    if (selectedEdge) {
      setEdges((eds) =>
        eds.map((edge) =>
          edge.id === selectedEdge
            ? { ...edge, data: { ...edge.data, relationship } }
            : edge
        )
      );
    }
    setMenuAnchor(null);
    setSelectedEdge(null);
  };

  return (
    <Box
      sx={{
        height: '70vh',
        border: '1px solid #ccc',
        '& .react-flow': { background: '#f8f8f8' },
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onEdgeClick={handleEdgeClick}
        fitView
      >
        <Controls />
        <Background />
      </ReactFlow>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => {
          setMenuAnchor(null);
          setSelectedEdge(null);
        }}
      >
        {relationshipTypes.map((type) => (
          <MenuItem
            key={type}
            onClick={() => handleRelationshipSelect(type)}
          >
            {type}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default StakeholderMap; 