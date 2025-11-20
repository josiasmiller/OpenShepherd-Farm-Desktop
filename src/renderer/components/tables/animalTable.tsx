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

import log from 'electron-log/renderer';

/**
 * Local display shape for normalized animal info.
 */
export type AnimalInfo = {
  id: string;
  flockPrefix: string;
  name: string;
  registrationNumber: string;
  birthDate: string;
  coatColor?: string;
};

interface AnimalInformationTableProps {
  /**
   * A list of animal IDs whose information should be fetched and displayed.
   */
  animalIds: string[];
}

/**
 * Converts shape of DB response into the expected shape for this component
 *  
 * @param abi DB field to be converted
 * @returns array of `AnimalInfo`
 */
export const normalizeAnimals = (abi: AnimalDetails[]): AnimalInfo[] => {
  return abi.map((a) => ({
    id: a.animalId,
    flockPrefix: a.flockPrefix ?? "—",
    name: a.name ?? "—",
    registrationNumber: a.registrationNumber ?? "—",
    birthDate: a.birthDate
      ? new Date(a.birthDate).toLocaleDateString()
      : "—",
    coatColor: a.coatColor ?? "—",
  }));
};

/**
 * Displays a styled table showing essential animal information.
 * 
 * @param animalIds AnimalInformationTableProps
 */
export const AnimalInformationTable: React.FC<AnimalInformationTableProps> = ({
  animalIds,
}) => {
  const [animalData, setAnimalData] = useState<AnimalInfo[]>([]);
  const [loading, setLoading] = useState(false);

  /**
   * Holds any error string that occurs
   */
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If no animals selected, clear current data + any errors.
    if (!animalIds || animalIds.length === 0) {
      setAnimalData([]);
      setError(null);
      return;
    }

    /**
     * Fetches animal basic information and updates component state.
     */
    const fetchAnimalData = async () => {
      setLoading(true);
      setError(null);

      const basicAnimalResult: Result<AnimalDetails[], string> = await window.animalAPI.getAnimalDetails(animalIds);

      let animalBasicInfo: AnimalDetails[] = [];

      await handleResult(basicAnimalResult, {
        success: (data) => {
          animalBasicInfo = data;
        },
        error: (err) => {
          log.error("Failed to get animalDetails:", err);
          setError(err); // store error and continue
        },
      });

      // Only map data if no error was recorded.
      if (!error) {
        const normalized = normalizeAnimals(animalBasicInfo);
        setAnimalData(normalized);
      }

      setLoading(false);
    };

    fetchAnimalData();
  }, [animalIds]);

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
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{
          flex: 1,
          overflowY: "auto",
          borderRadius: 2,
        }}
      >
        <Table stickyHeader>
          {/* Table Header */}
          <TableHead>
            <TableRow>
              {[
                "Registration Number",
                "Flock Prefix",
                "Animal Name",
                "Birth Date",
                "Coat Color",
              ].map((header) => (
                <TableCell
                  key={header}
                  sx={{
                    backgroundColor: "var(--md-sys-color-secondary-container)",
                    fontWeight: "bold",
                  }}
                >
                  <Typography
                    variant="h6"
                    fontFamily="Roboto Mono Bold"
                    sx={{ color: "var(--md-sys-color-primary)" }}
                  >
                    {header}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <Typography variant="body1" color="error" fontFamily="Roboto Mono">
                    Failed to load animal data.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : animalData.length > 0 ? (
              animalData.map((animal) => {
                const cellStyle = {
                  padding: "12px 16px",
                  borderBottom: "1px solid var(--md-sys-color-outline-variant)",
                  color: "var(--md-sys-color-on-surface-variant)",
                };

                return (
                  <TableRow
                    key={animal.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "var(--md-sys-color-surface-variant)",
                        transition: "background-color 0.2s ease-in-out",
                        cursor: "pointer",
                      },
                    }}
                  >
                    {[
                      animal.registrationNumber,
                      animal.flockPrefix,
                      animal.name,
                      animal.birthDate,
                      animal.coatColor,
                    ].map((value, idx) => (
                      <TableCell key={idx} sx={cellStyle}>
                        <Typography variant="body2" fontFamily="Roboto Mono">
                          {value}
                        </Typography>
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
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
