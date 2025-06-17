import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Box,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as ContentCopyIcon,
} from "@mui/icons-material";
import { Connection } from "@/types/connection";
import { useTranslation } from "react-i18next";

interface ConnectionListProps {
  connections: Connection[];
  datasetMap: Record<string, string>;
  onEdit: (connection: Connection) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

export const ConnectionList: React.FC<ConnectionListProps> = ({
  connections,
  datasetMap,
  onEdit,
  onDelete,
  onAdd,
}) => {
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const { t } = useTranslation();
  const getDatasetNames = (knowledgeIds: string[]) => {
    return knowledgeIds.map((id) => datasetMap[id] || id).join(", ");
  };

  const generateCurl = (connectionId: number) => {
    const apiUrl = import.meta.env.VITE_CONNECTION_API_URL;
    const domain = new URL(apiUrl).origin;

    const curlCommand = `curl -X 'POST' \\\n  '${domain}/api/dify/retrieveChunks' \\\n  -H 'accept: application/json' \\\n  -H 'Content-Type: application/json' \\\n  -d '{\n  "query": "hi",\n  "top_k": 3,\n  "connection_id": ${connectionId}\n}'`;

    return curlCommand;
  };

  const handleCopyCurl = async (connectionId: number) => {
    try {
      const curlCommand = generateCurl(connectionId);
      console.log("Generated cURL command:", curlCommand);

      try {
        await navigator.clipboard.writeText(curlCommand);
        console.log("cURL command copied to clipboard");
      } catch (clipboardError) {
        console.log("Clipboard API not available, creating temp input element");
        // Fallback: Create temporary input element
        const tempInput = document.createElement("input");
        tempInput.value = curlCommand;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
      }

      setSnackbar({
        open: true,
        message: "Đã copy cURL command vào clipboard",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Không thể copy cURL command",
        severity: "error",
      });
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" color="primary" onClick={onAdd}>
          {t("connection.addConnection")}
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>{t("connection.name")}</TableCell>
              <TableCell>{t("connection.customerID")}</TableCell>
              <TableCell>{t("connection.knowledge")}</TableCell>
              <TableCell>{t("connection.createdAt")}</TableCell>
              <TableCell>{t("connection.action")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {connections.map((connection) => (
              <TableRow key={connection.id}>
                <TableCell>{connection.id}</TableCell>
                <TableCell>{connection.name}</TableCell>
                <TableCell>{connection.customer_id}</TableCell>
                <TableCell>
                  <Tooltip
                    title={getDatasetNames(connection.knowledge_ids)}
                    arrow
                  >
                    <span>{getDatasetNames(connection.knowledge_ids)}</span>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  {new Date(connection.created_at).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Tooltip title="Copy CURL">
                    <IconButton
                      onClick={() => handleCopyCurl(connection.id)}
                      color="default"
                      size="small"
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t("connection.update")}>
                    <IconButton
                      onClick={() => onEdit(connection)}
                      color="primary"
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t("connection.delete")}>
                    <IconButton
                      onClick={() => onDelete(connection.id)}
                      color="error"
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
