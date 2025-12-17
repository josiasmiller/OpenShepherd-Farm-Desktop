import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";

import { GenericTable, TableColumn } from "./genericTable";

// Dummy Data
interface TestRow {
  id: string;
  name: string;
  age: number;
}

const columns: TableColumn<TestRow>[] = [
  {
    label: "Name",
    render: (row) => row.name,
  },
  {
    label: "Age",
    render: (row) => row.age,
  },
];

describe("GenericTable", () => {
  test("renders table headers", () => {
    render(<GenericTable rows={[]} columns={columns} />);

    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
  });

  test("renders loading state", () => {
    render(<GenericTable rows={[]} columns={columns} loading />);

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("renders error state", () => {
    const errorMsg = "Something went wrong";

    render(<GenericTable rows={[]} columns={columns} error={errorMsg} />);

    expect(screen.getByText(errorMsg)).toBeInTheDocument();
  });

  test("renders empty state when no rows exist", () => {
    render(
      <GenericTable
        rows={[]}
        columns={columns}
        emptyMessage="Nothing here"
      />
    );

    expect(screen.getByText("Nothing here")).toBeInTheDocument();
  });

  test("renders rows using render functions", () => {
    const rows: TestRow[] = [
      { id: "1", name: "Alice", age: 30 },
      { id: "2", name: "Bob", age: 40 },
    ];

    render(<GenericTable rows={rows} columns={columns} />);

    expect(screen.getByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();

    expect(screen.getByText("Bob")).toBeInTheDocument();
    expect(screen.getByText("40")).toBeInTheDocument();
  });

  test("renders rows using custom render function", () => {
    const rows: TestRow[] = [{ id: "1", name: "Alice", age: 30 }];

    const customCols: TableColumn<TestRow>[] = [
      {
        label: "Custom",
        render: (r) => `Hello ${r.name}`,
      },
    ];

    render(<GenericTable rows={rows} columns={customCols} />);

    expect(screen.getByText("Hello Alice")).toBeInTheDocument();
  });

  test("calls onRowClick when a row is clicked", () => {
    const rows: TestRow[] = [{ id: "1", name: "Alice", age: 30 }];
    const mockClick = jest.fn();

    render(
      <GenericTable rows={rows} columns={columns} onRowClick={mockClick} />
    );

    fireEvent.click(screen.getByText("Alice"));

    expect(mockClick).toHaveBeenCalledWith(rows[0]);
  });

  test("uses custom getRowKey()", () => {
    const rows: TestRow[] = [{ id: "ignored", name: "Test", age: 99 }];

    const getRowKey = jest.fn(() => "custom-key");

    render(
      <GenericTable
        rows={rows}
        columns={columns}
        getRowKey={getRowKey}
      />
    );

    expect(getRowKey).toHaveBeenCalledWith(rows[0]);
  });

  test("loading state takes precedence over error", () => {
    render(
      <GenericTable
        rows={[]}
        columns={columns}
        loading
        error="Should not appear"
      />
    );

    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.queryByText("Should not appear")).not.toBeInTheDocument();
  });

  test("error state takes precedence over empty state", () => {
    render(
      <GenericTable
        rows={[]}
        columns={columns}
        error="Error wins"
        emptyMessage="Empty loses"
      />
    );

    expect(screen.getByText("Error wins")).toBeInTheDocument();
    expect(screen.queryByText("Empty loses")).not.toBeInTheDocument();
  });
});
