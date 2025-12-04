import React, { useEffect, useState } from "react";
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

import { handleResult, Result } from "@common/core";
import { AnimalDetails } from "@app/api";
import log from "electron-log/renderer";

/** Table row shape */
export type AnimalInfo = {
  id: string;
  flockPrefix: string;
  name: string;
  registrationNumber: string;
  birthDate: string;
  coatColor?: string;
};

/** Column type for both base and extra columns */
interface Column {
  key: string;
  header: string;
  getValue: (animalId: string) => React.ReactNode;
}

interface AnimalInformationTableProps {
  animalIds: string[];
  extraColumns?: Column[];
  columnOrder?: string[];
}

/** Convert AnimalDetails to internal AnimalInfo */
export const normalizeAnimals = (animalDetails: AnimalDetails[]): AnimalInfo[] => {
  return animalDetails.map((a) => ({
    id: a.animalId,
    flockPrefix: a.flockPrefix ?? "—",
    name: a.name ?? "—",
    registrationNumber: a.registrationNumber ?? "—",
    birthDate: a.birthDate ? new Date(a.birthDate).toLocaleDateString() : "—",
    coatColor: a.coatColor ?? "—",
  }));
};

/**
 * A table to display general animal information as well as any other pertinent data that the caller defines
 * @param animalIds the AnimalIDs to be shown
 * @param extraColumns any extra column the caller wishes to display
 * @param columnOrder the order in which to define the columns of the table. Will throw if all is not handled
 */
export const AnimalInformationTable: React.FC<AnimalInformationTableProps> = ({
  animalIds,
  extraColumns = [],
  columnOrder,
}) => {
  const [animalData, setAnimalData] = useState<AnimalInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Map of animalId --> AnimalInfo
  const animalMap = new Map<string, AnimalInfo>();
  animalData.forEach(a => animalMap.set(a.id, a));

  useEffect(() => {
    if (!animalIds || animalIds.length === 0) {
      setAnimalData([]);
      setError(null);
      return;
    }

    const fetchAnimalData = async () => {
      setLoading(true);
      setError(null);

      const result: Result<AnimalDetails[], string> = await window.animalAPI.getAnimalDetails(animalIds);
      let details: AnimalDetails[] = [];

      await handleResult(result, {
        success: (data) => {
          details = data;
        },
        error: (err) => {
          log.error("Failed to get animalDetails:", err);
          setError(err);
        },
      });

      if (!error) {
        const normalized = normalizeAnimals(details);
        setAnimalData(normalized);
      }

      setLoading(false);
    };

    fetchAnimalData();
  }, [animalIds]);

  // ---------------------------------------------------------
  // Column ordering logic
  // ---------------------------------------------------------

  const baseColumns: Column[] = [
    { key: "registrationNumber", header: "Registration Number", getValue: id => animalMap.get(id)?.registrationNumber ?? "—" },
    { key: "flockPrefix", header: "Flock Prefix", getValue: id => animalMap.get(id)?.flockPrefix ?? "—" },
    { key: "name", header: "Animal Name", getValue: id => animalMap.get(id)?.name ?? "—" },
    { key: "birthDate", header: "Birth Date", getValue: id => animalMap.get(id)?.birthDate ?? "—" },
    { key: "coatColor", header: "Coat Color", getValue: id => animalMap.get(id)?.coatColor ?? "—" },
  ];

  const extraCols: Column[] = extraColumns.map(col => ({
    key: col.key,
    header: col.header,
    getValue: col.getValue,
  }));

  const allColumns = [...baseColumns, ...extraCols];
  const availableKeys = allColumns.map(c => c.key);
  const allColumnsMap = new Map(allColumns.map(c => [c.key, c]));

  let finalColumns: Column[];

  if (columnOrder) {
    // Check duplicates
    const duplicates = columnOrder.filter((k, i) => columnOrder.indexOf(k) !== i);
    if (duplicates.length) throw new Error(`columnOrder contains duplicates: ${duplicates.join(", ")}`);

    // Check unknown keys
    for (const key of columnOrder) {
      if (!availableKeys.includes(key)) {
        throw new Error(`columnOrder contains unknown key "${key}". Valid keys: ${availableKeys.join(", ")}`);
      }
    }

    // Check all columns included
    if (columnOrder.length !== availableKeys.length) {
      throw new Error(`columnOrder must include all columns. Missing: ${availableKeys.filter(k => !columnOrder.includes(k)).join(", ")}`);
    }

    finalColumns = columnOrder.map(k => allColumnsMap.get(k)!);
  } else {
    finalColumns = allColumns;
  }

  // ---------------------------------------------------------
  // Render
  // ---------------------------------------------------------

  return (
      <Box
          className="results-section"
          sx={{
            flex: 4,
            display: "flex",
            flexDirection: "column",
            padding: "20px",
            minHeight: 0,
            backgroundColor: "var(--md-sys-color-surface)",
            overflowY: "hidden",
          }}
      >
        <TableContainer component={Paper} elevation={3} sx={{ flex: 1, overflowY: "auto", borderRadius: 2 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {finalColumns.map(col => (
                    <TableCell key={col.key} sx={{ backgroundColor: "var(--md-sys-color-secondary-container)", fontWeight: "bold" }}>
                      <Typography variant="h6" fontFamily="Roboto Mono Bold" sx={{ color: "var(--md-sys-color-primary)" }}>
                        {col.header}
                      </Typography>
                    </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                  <TableRow>
                    <TableCell colSpan={finalColumns.length} align="center" sx={{ py: 4 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
              ) : error ? (
                  <TableRow>
                    <TableCell colSpan={finalColumns.length} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="error" fontFamily="Roboto Mono">
                        Failed to load animal data.
                      </Typography>
                    </TableCell>
                  </TableRow>
              ) : animalData.length > 0 ? (
                  animalData.map(animal => (
                      <TableRow key={animal.id} sx={{ "&:hover": { backgroundColor: "var(--md-sys-color-surface-variant)", transition: "background-color 0.2s ease-in-out", cursor: "pointer" } }}>
                        {finalColumns.map(col => (
                            <TableCell key={col.key} sx={{ padding: "12px 16px", borderBottom: "1px solid var(--md-sys-color-outline-variant)", color: "var(--md-sys-color-on-surface-variant)" }}>
                              <Typography variant="body2" fontFamily="Roboto Mono">
                                {col.getValue(animal.id)}
                              </Typography>
                            </TableCell>
                        ))}
                      </TableRow>
                  ))
              ) : (
                  <TableRow>
                    <TableCell colSpan={finalColumns.length} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="text.secondary" fontFamily="Roboto Mono">
                        No animal data found.
                      </Typography>
                    </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
  );
};
