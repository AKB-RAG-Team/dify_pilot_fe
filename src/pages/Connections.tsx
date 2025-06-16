import React from 'react';
import { Container, Typography, Alert, Snackbar } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ConnectionList } from '@/components/ConnectionList';
import { ConnectionForm } from '@/components/ConnectionForm';
import { connectionService } from '@/services/connection.service';
import { Connection, CreateConnectionDTO, UpdateConnectionDTO } from '@/types/connection';

export const Connections: React.FC = () => {
  const [selectedConnection, setSelectedConnection] = React.useState<Connection | undefined>();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const queryClient = useQueryClient();

  const { data: connections = [], isLoading, error } = useQuery('connections', () =>
    connectionService.getAll()
  );

  const createMutation = useMutation(connectionService.create, {
    onSuccess: () => {
      queryClient.invalidateQueries('connections');
      setSnackbar({
        open: true,
        message: 'Thêm connection thành công',
        severity: 'success',
      });
      setIsFormOpen(false);
    },
    onError: () => {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi thêm connection',
        severity: 'error',
      });
    },
  });

  const updateMutation = useMutation(
    ({ id, data }: { id: number; data: UpdateConnectionDTO }) =>
      connectionService.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('connections');
        setSnackbar({
          open: true,
          message: 'Cập nhật connection thành công',
          severity: 'success',
        });
        setIsFormOpen(false);
      },
      onError: () => {
        setSnackbar({
          open: true,
          message: 'Có lỗi xảy ra khi cập nhật connection',
          severity: 'error',
        });
      },
    }
  );

  const deleteMutation = useMutation(connectionService.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries('connections');
      setSnackbar({
        open: true,
        message: 'Xóa connection thành công',
        severity: 'success',
      });
    },
    onError: () => {
      setSnackbar({
        open: true,
        message: 'Có lỗi xảy ra khi xóa connection',
        severity: 'error',
      });
    },
  });

  const handleAdd = () => {
    setSelectedConnection(undefined);
    setIsEdit(false);
    setIsFormOpen(true);
  };

  const handleEdit = (connection: Connection) => {
    setSelectedConnection(connection);
    setIsEdit(true);
    setIsFormOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa connection này?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = (data: CreateConnectionDTO | UpdateConnectionDTO) => {
    if (isEdit && selectedConnection) {
      updateMutation.mutate({ id: selectedConnection.id, data: data as UpdateConnectionDTO });
    } else {
      createMutation.mutate(data as CreateConnectionDTO);
    }
  };

  if (isLoading) {
    return <Typography>Đang tải...</Typography>;
  }

  if (error) {
    return <Typography color="error">Có lỗi xảy ra khi tải dữ liệu</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Quản lý Connections
      </Typography>

      <ConnectionList
        connections={connections}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ConnectionForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        connection={selectedConnection}
        isEdit={isEdit}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}; 