import React from "react";
import { Paper, Typography } from "@mui/material";
import { FileList } from "./FileList";
import { FileItem } from "@/types/file";

interface AllFilesListProps {
  files: FileItem[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
  isLoading: boolean;
  onRefresh: () => void;
}

export const AllFilesList: React.FC<AllFilesListProps> = ({
  files,
  pagination,
  isLoading,
  onRefresh,
}) => {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Tất cả Files
      </Typography>
      <FileList
        files={files}
        pagination={pagination}
        isLoading={isLoading}
        onRefresh={onRefresh}
        showKnowledgeBaseId={true}
      />
    </Paper>
  );
};
