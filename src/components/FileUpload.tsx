import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Alert,
  LinearProgress,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import { fileService } from "@/services/file.service";

interface FileUploadProps {
  onUploadSuccess?: () => void;
  defaultKnowledgeBaseId?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadSuccess,
  defaultKnowledgeBaseId,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [knowledgeBaseId, setKnowledgeBaseId] = useState(
    defaultKnowledgeBaseId || ""
  );
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const allowedTypes = [
    "application/pdf",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
  ];
  const maxSize = 15 * 1024 * 1024; // 15MB

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!allowedTypes.includes(file.type)) {
      setMessage({
        type: "error",
        text: "File type không được hỗ trợ. Chỉ chấp nhận: PDF, PPT, DOC, TXT",
      });
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      setMessage({
        type: "error",
        text: "File quá lớn. Kích thước tối đa là 15MB",
      });
      return;
    }

    setSelectedFile(file);
    setMessage(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);
    setMessage(null);

    try {
      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fileService.upload(
        selectedFile,
        knowledgeBaseId || undefined
      );

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.success) {
        setMessage({
          type: "success",
          text: `File "${response.data.originalName}" đã được upload thành công!`,
        });
        setSelectedFile(null);
        if (!defaultKnowledgeBaseId) {
          setKnowledgeBaseId("");
        }
        onUploadSuccess?.();

        // Reset form
        const fileInput = document.getElementById(
          "file-input"
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text:
          error.response?.data?.error?.message ||
          "Upload thất bại. Vui lòng thử lại.",
      });
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <Box sx={{ maxWidth: 500 }}>
      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }}>
          {message.text}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <input
          id="file-input"
          type="file"
          onChange={handleFileSelect}
          accept=".pdf,.ppt,.pptx,.doc,.docx,.txt"
          style={{ display: "none" }}
        />
        <label htmlFor="file-input">
          <Button
            variant="outlined"
            component="span"
            startIcon={<CloudUploadIcon />}
            fullWidth
            sx={{ mb: 2 }}
          >
            Chọn File
          </Button>
        </label>

        {selectedFile && (
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                <strong>File:</strong> {selectedFile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Kích thước:</strong> {formatFileSize(selectedFile.size)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Loại:</strong> {selectedFile.type}
              </Typography>
            </CardContent>
          </Card>
        )}

        {!defaultKnowledgeBaseId && (
          <TextField
            label="Knowledge Base ID (Optional)"
            value={knowledgeBaseId}
            onChange={(e) => setKnowledgeBaseId(e.target.value)}
            fullWidth
            size="small"
            helperText="Để trống nếu sử dụng KB mặc định"
            sx={{ mb: 2 }}
          />
        )}
      </Box>

      {uploading && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Đang upload... {uploadProgress}%
          </Typography>
        </Box>
      )}

      <Button
        variant="contained"
        onClick={handleUpload}
        disabled={!selectedFile || uploading}
        fullWidth
      >
        {uploading ? "Đang Upload..." : "Upload File"}
      </Button>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 2, display: "block" }}
      >
        Hỗ trợ: PDF, PPT, DOC, TXT. Tối đa 15MB.
      </Typography>
    </Box>
  );
};
