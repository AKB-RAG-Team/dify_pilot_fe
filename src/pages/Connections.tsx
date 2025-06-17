import React from "react";
import { Container, Typography, Alert, Snackbar } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { ConnectionList } from "@/components/ConnectionList";
import { ConnectionForm } from "@/components/ConnectionForm";
import { connectionService } from "@/services/connection.service";
import { difyService } from "@/services/dify.service";
import {
  Connection,
  CreateConnectionDTO,
  UpdateConnectionDTO,
} from "@/types/connection";
import { useTranslation } from "react-i18next";

export const Connections: React.FC = () => {
  const [selectedConnection, setSelectedConnection] = React.useState<
    Connection | undefined
  >();
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const { t } = useTranslation();

  const queryClient = useQueryClient();

  const { data: connections = [], isLoading: isLoadingConnections } = useQuery(
    "connections",
    () => connectionService.getAll()
  );

  const { data: datasets = [], isLoading: isLoadingDatasets } = useQuery(
    "datasets",
    () => difyService.getAllDataset()
  );

  // Create a map of dataset IDs to names for easy lookup
  const datasetMap = React.useMemo(() => {
    return datasets.reduce((acc, dataset) => {
      acc[dataset.id] = dataset.name;
      return acc;
    }, {} as Record<string, string>);
  }, [datasets]);

  const createMutation = useMutation(connectionService.create, {
    onSuccess: () => {
      queryClient.invalidateQueries("connections");
      setSnackbar({
        open: true,
        message: "Thêm connection thành công",
        severity: "success",
      });
      setIsFormOpen(false);
    },
    onError: () => {
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra khi thêm connection",
        severity: "error",
      });
    },
  });

  const updateMutation = useMutation(
    ({ id, data }: { id: number; data: UpdateConnectionDTO }) =>
      connectionService.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("connections");
        setSnackbar({
          open: true,
          message: "Cập nhật connection thành công",
          severity: "success",
        });
        setIsFormOpen(false);
      },
      onError: () => {
        setSnackbar({
          open: true,
          message: "Có lỗi xảy ra khi cập nhật connection",
          severity: "error",
        });
      },
    }
  );

  const deleteMutation = useMutation(connectionService.delete, {
    onSuccess: () => {
      queryClient.invalidateQueries("connections");
      setSnackbar({
        open: true,
        message: "Xóa connection thành công",
        severity: "success",
      });
    },
    onError: () => {
      setSnackbar({
        open: true,
        message: "Có lỗi xảy ra khi xóa connection",
        severity: "error",
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
    if (window.confirm("Bạn có chắc chắn muốn xóa connection này?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSubmit = async (
    data: CreateConnectionDTO | UpdateConnectionDTO
  ) => {
    if (isEdit && selectedConnection) {
      updateMutation.mutate({
        id: selectedConnection.id,
        data: data as UpdateConnectionDTO,
      });
    } else {
      createMutation.mutate(data as CreateConnectionDTO);
    }
  };

  const isLoading = isLoadingConnections || isLoadingDatasets;

  if (isLoading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t("nav.connections")}
      </Typography>
      <ConnectionList
        connections={connections}
        datasetMap={datasetMap}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
      />{" "}
      <ConnectionForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        connection={selectedConnection}
        isEdit={isEdit}
      />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};
