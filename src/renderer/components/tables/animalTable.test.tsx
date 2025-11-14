import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import Swal from "sweetalert2";
import { AnimalInformationTable } from "./animalTable";

import { AnimalBasicInfo } from "packages/api"
import { handleResult } from "packages/core"

jest.mock("packages/core", () => ({
  handleResult: jest.fn(),
}));

// Mock the global window API
declare global {
  interface Window {
    animalAPI: {
      getBasicAnimalInfo: jest.Mock;
    };
  }
}
window.animalAPI = {
  getBasicAnimalInfo: jest.fn(),
};

describe("AnimalInformationTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders 'No animal data found.' when no animalIds are provided", () => {
    render(<AnimalInformationTable animalIds={[]} />);
    expect(screen.getByText("No animal data found.")).toBeInTheDocument();
  });

  test("renders loading state then table rows with normalized data", async () => {
    const mockAnimals: AnimalBasicInfo[] = [
      {
        animalId: "1",
        flockPrefix: "Desert Where",
        name: "Boba Fett",
        registrationNumber: "12345",
        birthDate: "2024-03-10T00:00:00Z",
        coatColor: "Black",
      },
      {
        animalId: "2",
        flockPrefix: "Desert Where",
        name: "Craig",
        registrationNumber: "09876",
        birthDate: "2020-01-24T00:00:00Z",
        coatColor: "White",
      },
    ];

    // Mock getBasicAnimalInfo returning a successful Result
    const mockResult = { ok: true, value: mockAnimals };
    (window.animalAPI.getBasicAnimalInfo as jest.Mock).mockResolvedValueOnce(mockResult);

    // Mock handleResult to immediately call the success handler
    (handleResult as jest.Mock).mockImplementation(async (res, handlers) => {
      handlers.success(mockAnimals);
    });

    render(<AnimalInformationTable animalIds={["1", "2"]} />);

    // Loading state should appear first
    expect(await screen.findByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(window.animalAPI.getBasicAnimalInfo).toHaveBeenCalledWith(["1", "2"]);
    });

    // After load completes, check displayed rows
    await waitFor(() => {
      expect(screen.getByText("12345")).toBeInTheDocument();
      expect(screen.getByText("Desert Where")).toBeInTheDocument();
      expect(screen.getByText("Boba Fett")).toBeInTheDocument();
      expect(screen.getByText("Black")).toBeInTheDocument();
        // TODO --> handle non-animal data
    //   expect(screen.getAllByText("—").length).toBeGreaterThan(0);
    });
  });

  test("shows SweetAlert error dialog when fetching fails", async () => {
    (window.animalAPI.getBasicAnimalInfo as jest.Mock).mockRejectedValueOnce(
      new Error("Fetch failed")
    );

    render(<AnimalInformationTable animalIds={["bad-id"]} />);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: "Failed to Load Animal Info",
          text: "Fetch failed",
        })
      );
    });

    expect(screen.getByText("No animal data found.")).toBeInTheDocument();
  });

  test("handles handleResult error path properly", async () => {
    const mockResult = { ok: false, error: "Server error" };
    (window.animalAPI.getBasicAnimalInfo as jest.Mock).mockResolvedValueOnce(mockResult);

    (handleResult as jest.Mock).mockImplementation(async (res, handlers) => {
      handlers.error("Server error");
    });

    render(<AnimalInformationTable animalIds={["bad-id"]} />);

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: "error",
          title: "Failed to Load Animal Info",
          text: "Server error",
        })
      );
    });
  });
});
