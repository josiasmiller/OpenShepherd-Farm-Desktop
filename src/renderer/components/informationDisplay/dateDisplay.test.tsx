import '@testing-library/jest-dom';
import { render, screen } from "@testing-library/react";
import { DateDisplay } from "./dateDisplay";

describe("DateDisplay", () => {
  test("renders the provided title and value", () => {
    render(<DateDisplay title="Created At" value="2025-11-13" />);
    expect(screen.getByText("Created At")).toBeInTheDocument();
    expect(screen.getByText("2025-11-13")).toBeInTheDocument();
  });

  test("renders em dash when value is undefined", () => {
    render(<DateDisplay title="Updated At" value={undefined} />);
    expect(screen.getByText("Updated At")).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  test("renders em dash when value is null", () => {
    render(<DateDisplay title="Deleted At" value={null} />);
    expect(screen.getByText("Deleted At")).toBeInTheDocument();
    expect(screen.getByText("—")).toBeInTheDocument();
  });
});
