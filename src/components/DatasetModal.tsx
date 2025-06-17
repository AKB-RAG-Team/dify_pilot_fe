import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Divider,
  Paper,
} from "@mui/material";
import { useQuery } from "react-query";
import { fileService } from "@/services/file.service";
import { Dataset } from "@/types/dify";
import { FileUpload } from "./FileUpload";
import { FileList } from "./FileList";

interface DatasetModalProps {
  open: boolean;
  dataset: Dataset;
  onClose: () => void;
}

export const DatasetModal: React.FC<DatasetModalProps> = ({
  open,
  dataset,
  onClose,
}) => {
  const {
    data: filesData,
    isLoading,
    refetch: refetchFiles,
  } = useQuery(
    ["dataset-files", dataset.id],
    () =>
      fileService.getAll({
        knowledge_base_id: dataset.id.toString(),
      }),
    {
      enabled: open,
      refetchInterval: 20000,
    }
  );

  const handleUploadSuccess = () => {
    refetchFiles();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: { height: "90vh" },
      }}
    >
      <DialogTitle>
        <Typography variant="h6">{dataset.name}</Typography>
        <Typography variant="body2" color="text.secondary">
          Knowledge Base ID: {dataset.id}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Upload File
          </Typography>
          <FileUpload
            onUploadSuccess={handleUploadSuccess}
            defaultKnowledgeBaseId={dataset.id.toString()}
          />
        </Paper>

        <Divider />

        <Box sx={{ flexGrow: 1, minHeight: 0 }}>
          <Typography variant="h6" gutterBottom>
            Files trong Dataset này
          </Typography>
          <FileList
            files={filesData?.data || []}
            pagination={filesData?.pagination}
            isLoading={isLoading}
            onRefresh={refetchFiles}
            showKnowledgeBaseId={false}
            allowReprocess={true}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};
