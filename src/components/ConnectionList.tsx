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
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Connection } from '@/types/connection';

interface ConnectionListProps {
  connections: Connection[];
  onEdit: (connection: Connection) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

export const ConnectionList: React.FC<ConnectionListProps> = ({
  connections,
  onEdit,
  onDelete,
  onAdd,
}) => {
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
              <TableCell>Knowledge IDs</TableCell>
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
                <TableCell>{connection.knowledge_ids.join(', ')}</TableCell>
                <TableCell>
                  {new Date(connection.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => onEdit(connection)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => onDelete(connection.id)}
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