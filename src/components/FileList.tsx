import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Typography,
  Box,
  Tooltip,
  Button,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import {
  Refresh as RefreshIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  PlayArrow as PlayArrowIcon,
  Visibility as VisibilityIcon,
  Replay as ReplayIcon,
} from "@mui/icons-material";
import { FileItem } from "@/types/file";
import { fileService } from "@/services/file.service";
import { useQuery } from "react-query";

interface FileListProps {
  files: FileItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  isLoading: boolean;
  onRefresh: () => void;
  showKnowledgeBaseId?: boolean;
  allowReprocess?: boolean;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  pagination,
  isLoading,
  onRefresh,
  showKnowledgeBaseId = false,
  allowReprocess = false,
}) => {
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [showChunks, setShowChunks] = useState(false);

  const { data: chunksData, isLoading: chunksLoading } = useQuery(
    ["file-chunks", selectedFileId],
    () => (selectedFileId ? fileService.getChunks(selectedFileId) : null),
    {
      enabled: !!selectedFileId && showChunks,
    }
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "uploaded":
        return "default";
      case "processing":
        return "warning";
      case "processed":
        return "success";
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "uploaded":
        return "Đã upload";
      case "processing":
        return "Đang xử lý";
      case "processed":
        return "Đã xử lý";
      case "failed":
        return "Thất bại";
      default:
        return status;
    }
  };

  const handleProcessFile = async (fileId: string) => {
    try {
      await fileService.process(fileId, {});
      onRefresh();
    } catch (error) {
      console.error("Failed to process file:", error);
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa file này?")) {
      try {
        await fileService.delete(fileId);
        onRefresh();
      } catch (error) {
        console.error("Failed to delete file:", error);
      }
    }
  };

  const handleDownloadFile = async (fileId: string, fileName: string) => {
    try {
      const blob = await fileService.download(fileId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to download file:", error);
    }
  };

  const handleViewChunks = (fileId: string) => {
    setSelectedFileId(fileId);
    setShowChunks(true);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN");
  };

  return (
    <>
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">
          Tổng: {pagination?.total || 0} files
        </Typography>
        <Button
          variant="outlined"
          startIcon={
            isLoading ? <CircularProgress size={16} /> : <RefreshIcon />
          }
          onClick={onRefresh}
          disabled={isLoading}
        >
          Refresh
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên File</TableCell>
              <TableCell>Kích thước</TableCell>
              <TableCell>Trạng thái</TableCell>
              {showKnowledgeBaseId && <TableCell>Knowledge Base ID</TableCell>}
              <TableCell>Ngày tạo</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {files.map((file) => (
              <TableRow key={file.id}>
                <TableCell>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {file.originalName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {file.filename}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>{formatFileSize(file.size)}</TableCell>
                <TableCell>
                  <Chip
                    label={getStatusText(file.status)}
                    color={getStatusColor(file.status) as any}
                    size="small"
                  />
                  {file.processingError && (
                    <Tooltip title={file.processingError}>
                      <Typography
                        variant="caption"
                        color="error"
                        display="block"
                      >
                        Error
                      </Typography>
                    </Tooltip>
                  )}
                </TableCell>
                {showKnowledgeBaseId && (
                  <TableCell>
                    <Typography variant="caption">
                      {file.difyKnowledgeBaseId || "N/A"}
                    </Typography>
                  </TableCell>
                )}
                <TableCell>{formatDate(file.createdAt)}</TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    {file.status === "uploaded" && (
                      <Tooltip title="Xử lý với Dify">
                        <IconButton
                          size="small"
                          onClick={() => handleProcessFile(file.id)}
                          color="primary"
                        >
                          <PlayArrowIcon />
                        </IconButton>
                      </Tooltip>
                    )}

                    {allowReprocess &&
                      (file.status === "processed" ||
                        file.status === "failed") && (
                        <Tooltip title="Xử lý lại">
                          <IconButton
                            size="small"
                            onClick={() => handleProcessFile(file.id)}
                            color="warning"
                          >
                            <ReplayIcon />
                          </IconButton>
                        </Tooltip>
                      )}

                    {file.status === "processed" && (
                      <Tooltip title="Xem chunks">
                        <IconButton
                          size="small"
                          onClick={() => handleViewChunks(file.id)}
                          color="info"
                        >
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    )}

                    <Tooltip title="Download">
                      <IconButton
                        size="small"
                        onClick={() =>
                          handleDownloadFile(file.id, file.originalName)
                        }
                        color="default"
                      >
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Xóa">
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteFile(file.id)}
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {pagination && (
        <TablePagination
          component="div"
          count={pagination.total}
          page={pagination.page - 1}
          onPageChange={() => {}}
          rowsPerPage={pagination.limit}
          onRowsPerPageChange={() => {}}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
          }
          labelRowsPerPage="Rows per page:"
        />
      )}

      <Dialog
        open={showChunks}
        onClose={() => setShowChunks(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>File Chunks</DialogTitle>
        <DialogContent>
          {chunksLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Box>
              {chunksData?.data.chunks.map((chunk) => (
                <Paper key={chunk.id} sx={{ p: 2, mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    <strong>Chunk</strong> {chunk.position}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Content:</strong> {chunk.content}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Word count:</strong> {chunk.wordCount}
                  </Typography>
                </Paper>
              ))}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowChunks(false)}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
