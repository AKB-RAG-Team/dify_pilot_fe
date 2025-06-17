import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  CardActionArea,
  Box,
  CircularProgress,
  Paper,
} from "@mui/material";
import { Folder as FolderIcon } from "@mui/icons-material";
import { Dataset } from "@/types/dify";

interface DatasetListProps {
  datasets: Dataset[];
  isLoading: boolean;
  onDatasetClick: (dataset: Dataset) => void;
}

export const DatasetList: React.FC<DatasetListProps> = ({
  datasets,
  isLoading,
  onDatasetClick,
}) => {
  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (datasets.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="h6" color="text.secondary">
          Không có dataset nào
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Danh sách Knowledge Base ({datasets.length})
      </Typography>

      <Grid container spacing={2}>
        {datasets.map((dataset) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={dataset.id}>
            <Card>
              <CardActionArea onClick={() => onDatasetClick(dataset)}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <FolderIcon color="primary" sx={{ mr: 1 }} />
                    <Typography variant="h6" component="div" noWrap>
                      {dataset.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    ID: {dataset.id}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};
