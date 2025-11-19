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

import { Owner, OwnerType, Contact, Company } from "@app/api";
import { unwrapOrThrow } from "@common/core";
import log from 'electron-log/renderer';

/**
 * Local display shape for normalized owner info.
 */
export type OwnerInfo = {
  id: string;
  type: OwnerType;
  name: string;
  flockId: string;
  phoneNumber: string;
  scrapieId?: string | null;
  premise: string;
};

export interface OwnerInformationTableProps {
  /** Array of owners to display, including OwnerType */
  owners: { ownerId: string; ownerType: OwnerType }[];
}

/**
 * Converts raw API responses into a normalized UI-friendly structure.
 */
export const normalizeOwners = (owners: Owner[]): OwnerInfo[] => {
  return owners.map((owner) => {
    let displayName: string;
    if (owner.type === OwnerType.CONTACT) {
      const c: Contact = owner.contact;
      displayName = `${c.firstName} ${c.lastName}`;
    } else {
      const co: Company = owner.company;
      displayName = co.name;
    }

    return {
      id: owner.type === OwnerType.CONTACT ? owner.contact.id : owner.company.id,
      type: owner.type,
      name: displayName,
      flockId: owner.flockId ?? "—",
      phoneNumber: owner.phoneNumber ?? "—",
      scrapieId: owner.scrapieId?.scrapieName ?? "—",
      premise: owner.premise.address ?? "—",
    };
  });
};

/**
 * Displays a styled table showing owner information.
 */
export const OwnerInformationTable: React.FC<OwnerInformationTableProps> = ({
  owners,
}) => {
  const [ownerData, setOwnerData] = useState<OwnerInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!owners || owners.length === 0) {
      setOwnerData([]);
      setError(null);
      return;
    }

    const fetchOwnerData = async () => {
      setLoading(true);
      setError(null);

      try {
        const collected: Owner[] = [];
        for (const { ownerId, ownerType } of owners) {
          const result: Owner = await unwrapOrThrow(
            window.lookupAPI.getOwnerById(ownerId, ownerType)
          );
          collected.push(result);
        }

        const normalized = normalizeOwners(collected);
        setOwnerData(normalized);
      } catch (err: any) {
        log.error("Error fetching owner data:", err?.message);
        setError(err?.message ?? "Unknown error while fetching owner data.");
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerData();
  }, [owners]);

  const cellStyle = {
    padding: "12px 16px",
    borderBottom: "1px solid var(--md-sys-color-outline-variant)",
    color: "var(--md-sys-color-on-surface-variant)",
  };

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
              {["Name", "Membership Number", "Phone", "Scrapie Flock ID", "Premise"].map(
                (header) => (
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
                )
              )}
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
                  <Typography
                    variant="body1"
                    color="error"
                    fontFamily="Roboto Mono"
                  >
                    Failed to load owner data: {error}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : ownerData.length > 0 ? (
              ownerData.map((owner) => (
                <TableRow
                  key={owner.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: "var(--md-sys-color-surface-variant)",
                      transition: "background-color 0.2s ease-in-out",
                      cursor: "pointer",
                    },
                  }}
                >
                  {[
                    owner.name,
                    owner.flockId,
                    owner.phoneNumber,
                    owner.scrapieId ?? "—",
                    owner.premise,
                  ].map((value, idx) => (
                    <TableCell key={idx} sx={cellStyle}>
                      <Typography variant="body2" fontFamily="Roboto Mono">
                        {value}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    fontFamily="Roboto Mono"
                  >
                    No owner data found.
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
