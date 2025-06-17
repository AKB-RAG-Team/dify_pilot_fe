import React, { useState } from "react";
import { Box, Typography, Paper, ButtonGroup, Button } from "@mui/material";
import { useQuery } from "react-query";
import { difyService } from "@/services/dify.service";
import { fileService } from "@/services/file.service";
import { DatasetList } from "@/components/DatasetList";
import { AllFilesList } from "@/components/AllFilesList";
import { DatasetModal } from "@/components/DatasetModal";
import { Dataset } from "@/types/dify";

export const ImportDoc: React.FC = () => {
  const [viewMode, setViewMode] = useState<"datasets" | "files">("datasets");
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: datasets = [], isLoading: datasetsLoading } = useQuery(
    "datasets",
    () => difyService.getAllDataset()
  );

  const {
    data: allFilesData,
    isLoading: filesLoading,
    refetch: refetchAllFiles,
  } = useQuery("all-files", () => fileService.getAll(), {
    enabled: viewMode === "files",
    refetchInterval: 20000,
  });

  const handleDatasetClick = (dataset: Dataset) => {
    setSelectedDataset(dataset);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedDataset(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Import Tài liệu
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <ButtonGroup variant="outlined" fullWidth>
          <Button
            variant={viewMode === "datasets" ? "contained" : "outlined"}
            onClick={() => setViewMode("datasets")}
          >
            Xem theo Dataset
          </Button>
          <Button
            variant={viewMode === "files" ? "contained" : "outlined"}
            onClick={() => setViewMode("files")}
          >
            Xem tất cả Files
          </Button>
        </ButtonGroup>
      </Paper>

      {viewMode === "datasets" ? (
        <DatasetList
          datasets={datasets}
          isLoading={datasetsLoading}
          onDatasetClick={handleDatasetClick}
        />
      ) : (
        <AllFilesList
          files={allFilesData?.data || []}
          pagination={allFilesData?.pagination}
          isLoading={filesLoading}
          onRefresh={refetchAllFiles}
        />
      )}

      {selectedDataset && (
        <DatasetModal
          open={modalOpen}
          dataset={selectedDataset}
          onClose={handleCloseModal}
        />
      )}
    </Box>
  );
};
