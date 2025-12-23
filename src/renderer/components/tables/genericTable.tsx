import React from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Typography,
} from "@mui/material";
import {HasId, HasName} from "@app/api";

// Row key strategies
export const ID_AS_ROW_KEY = (row: HasId): string => row.id;
export const NAME_AS_ROW_KEY = (row: HasName): string => row.name;

// Table types
export interface TableColumn<T> {
  label: string;
  render: (row: T) => React.ReactNode;
}

export interface GenericTableProps<T> {
  rows: T[];
  columns: TableColumn<T>[];
  getRowKey: (row: T) => string;
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

// Component
export function GenericTable<T>({
  rows,
  columns,
  getRowKey,
  loading = false,
  error = null,
  emptyMessage = "No data found.",
  onRowClick,
}: GenericTableProps<T>) {
  const cellStyle = {
    padding: "12px 16px",
    borderBottom: "1px solid var(--md-sys-color-outline-variant)",
    color: "var(--md-sys-color-on-surface-variant)",
  };

  const renderLoading = () => (
    <TableRow>
      <TableCell colSpan={columns.length} align="center" sx={{ py: 4 }}>
        <CircularProgress />
      </TableCell>
    </TableRow>
  );

  const renderError = () => (
    <TableRow>
      <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
        <Typography variant="body1" color="error" fontFamily="Roboto Mono">
          {error}
        </Typography>
      </TableCell>
    </TableRow>
  );

  const renderEmpty = () => (
    <TableRow>
      <TableCell colSpan={columns.length} align="center" sx={{ py: 3 }}>
        <Typography
          variant="body1"
          color="text.secondary"
          fontFamily="Roboto Mono"
        >
          {emptyMessage}
        </Typography>
      </TableCell>
    </TableRow>
  );

  const renderRows = () =>
    rows.map((row) => {
      const key = getRowKey(row);

      return (
        <TableRow
          key={key}
          onClick={() => onRowClick?.(row)}
          sx={{
            transition: "background-color 0.2s ease-in-out",
            cursor: onRowClick ? "pointer" : "default",
            "&:hover": {
              backgroundColor: "var(--md-sys-color-surface-variant)",
            },
          }}
        >
          {columns.map((col, idx) => (
            <TableCell key={idx} sx={cellStyle}>
              <Typography variant="body2" fontFamily="Roboto Mono">
                {col.render(row)}
              </Typography>
            </TableCell>
          ))}
        </TableRow>
      );
    });

  const renderTableContent = () => {
    if (loading) return renderLoading();
    if (error) return renderError();
    if (rows.length === 0) return renderEmpty();
    return renderRows();
  };

  return (
    <Box
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        backgroundColor: "var(--md-sys-color-surface)",
        overflow: "hidden",
      }}
    >
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{ flex: 1, overflowY: "auto", borderRadius: 2 }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell
                  key={col.label}
                  sx={{
                    backgroundColor:
                      "var(--md-sys-color-secondary-container)",
                    fontWeight: "bold",
                  }}
                >
                  <Typography
                    variant="h6"
                    fontFamily="Roboto Mono Bold"
                    sx={{ color: "var(--md-sys-color-primary)" }}
                  >
                    {col.label}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>{renderTableContent()}</TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
