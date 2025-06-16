import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ListItemText,
  Checkbox,
  OutlinedInput 
} from '@mui/material';
import { Connection, CreateConnectionDTO, UpdateConnectionDTO } from '@/types/connection';
import { useQuery } from 'react-query';
import { difyService } from '@/services/dify.service';

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
  const { data: datasets = [] } = useQuery('datasets', () => difyService.getAllDataset());

  const [formData, setFormData] = React.useState<CreateConnectionDTO | UpdateConnectionDTO>({
    name: '',
    customer_id: '',
    knowledge_ids: [],
  });
  // Reset form data when dialog opens or connection changes
  React.useEffect(() => {
    if (open) {
      setFormData({
        name: connection?.name || '',
        customer_id: connection?.customer_id || '',
        knowledge_ids: connection?.knowledge_ids || []
      });
    }
  }, [open, connection]);

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
            <FormControl fullWidth>
              <InputLabel id="knowledge-select-label">Knowledge</InputLabel>
              <Select
                labelId="knowledge-select-label"
                id="knowledge-select"
                multiple
                value={formData.knowledge_ids}
                input={<OutlinedInput label="Knowledge" />}
                onChange={(e) => {
                  const value = e.target.value as string[];
                  setFormData((prev) => ({
                    ...prev,
                    knowledge_ids: value,
                  }));
                }}
                renderValue={(selected) => {
                  const selectedNames = selected.map(id =>
                    datasets.find(d => String(d.id) === String(id))?.name || id
                  );
                  return selectedNames.join(', ');
                }}
              >
                {datasets.map((dataset) => (
                  <MenuItem key={dataset.id} value={dataset.id}>
                    <Checkbox checked={(formData.knowledge_ids ?? []).indexOf(String(dataset.id)) > -1} />
                    <ListItemText primary={dataset.name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="contained" color="primary">
            {isEdit ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};