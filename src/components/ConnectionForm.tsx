import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { Connection, CreateConnectionDTO, UpdateConnectionDTO } from '@/types/connection';

interface ConnectionFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateConnectionDTO | UpdateConnectionDTO) => void;
  connection?: Connection;
  isEdit?: boolean;
}

export const ConnectionForm: React.FC<ConnectionFormProps> = ({
  open,
  onClose,
  onSubmit,
  connection,
  isEdit = false,
}) => {
  const [formData, setFormData] = React.useState<CreateConnectionDTO | UpdateConnectionDTO>({
    name: connection?.name || '',
    customer_id: connection?.customer_id || '',
    knowledge_ids: connection?.knowledge_ids || [],
  });

  React.useEffect(() => {
    if (connection) {
      setFormData({
        name: connection.name,
        customer_id: connection.customer_id,
        knowledge_ids: connection.knowledge_ids,
      });
    }
  }, [connection]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isEdit ? 'Chỉnh sửa Connection' : 'Thêm Connection mới'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="name"
              label="Tên"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />
            {!isEdit && (
              <TextField
                name="customer_id"
                label="Customer ID"
                value={formData.customer_id}
                onChange={handleChange}
                required
                fullWidth
              />
            )}
            <TextField
              name="knowledge_ids"
              label="Knowledge IDs (phân cách bằng dấu phẩy)"
              value={formData.knowledge_ids?.join(', ') || ''}
              onChange={(e) => {
                const value = e.target.value;
                setFormData((prev) => ({
                  ...prev,
                  knowledge_ids: value
                    ? value.split(',').map((id) => id.trim())
                    : [],
                }));
              }}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="contained" color="primary">
            {isEdit ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}; 