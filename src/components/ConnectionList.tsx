import React from 'react';
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
  Box,
  Tooltip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Connection } from '@/types/connection';

interface ConnectionListProps {
  connections: Connection[];
  datasetMap: Record<string, string>;
  onEdit: (connection: Connection) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

export const ConnectionList: React.FC<ConnectionListProps> = ({
  connections,
  datasetMap,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const getDatasetNames = (knowledgeIds: string[]) => {
    return knowledgeIds.map((id) => datasetMap[id] || id).join(', ');
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="contained" color="primary" onClick={onAdd}>
          Thêm Connection
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Customer ID</TableCell>
              <TableCell>Knowledge</TableCell>
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {connections.map((connection) => (
              <TableRow key={connection.id}>
                <TableCell>{connection.id}</TableCell>
                <TableCell>{connection.name}</TableCell>
                <TableCell>{connection.customer_id}</TableCell>
                <TableCell>
                  <Tooltip
                    title={getDatasetNames(connection.knowledge_ids)}
                    arrow
                  >
                    <span>{getDatasetNames(connection.knowledge_ids)}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  {new Date(connection.created_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => onEdit(connection)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => onDelete(connection.id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};