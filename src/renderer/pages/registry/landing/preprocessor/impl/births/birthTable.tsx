import React from "react";
import { BirthNotification } from "@app/api";
import {GenericTable, TableColumn} from "@components/tables/genericTable";

type BirthsTableProps = {
  rows: BirthNotification[];
  loading?: boolean;
  error?: string | null;
};

export function BirthsTable({ rows, loading, error }: BirthsTableProps) {
  const columns: TableColumn<BirthNotification>[] = [
    {
      label: "Animal Name",
      field: "animalName",
    },
    {
      label: "Sex",
      render: (row) => row.sex?.name ?? "—",
    },
    {
      label: "Birth Date",
      render: (row) =>
        row.birthdate
          ? new Date(row.birthdate).toLocaleDateString()
          : "—",
    },
    {
      label: "Birth Type",
      render: row => `${row.birthType.name ?? "—"}`
    },
    {
      label: "Weight",
      render: (row) => `${row.weight ?? "—"} ${row.weightUnits?.name ?? "—"}`.trim() || "—",
    },
    {
      label: "Coat Color",
      render: (row) => row.coatColor?.name ?? "—",
    },
    {
      label: "Breeder",
      render: (row) => row.breeder?.name ?? "—",
    },
  ];

  return (
    <GenericTable
      rows={rows}
      columns={columns}
      loading={loading}
      error={error}
      emptyMessage="No birth records found."
      getRowKey={
        (row) => `${row.animalName}-${row.birthdate}`
      }
    />
  );
}
