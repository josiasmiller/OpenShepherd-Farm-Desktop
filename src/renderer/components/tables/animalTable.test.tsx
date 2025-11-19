import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import log from "electron-log/renderer";

import { AnimalInformationTable, normalizeAnimals } from "./animalTable";
import { handleResult } from "@common/core";
import { AnimalDetails } from "@app/api";

// ==================================================
// MOCKS
jest.mock("electron-log/renderer", () => ({
  error: jest.fn(),
}));

jest.mock("@common/core", () => ({
  handleResult: jest.fn(),
}));

jest.mock('uuid', () => ({
  validate: jest.fn().mockReturnValue(true),
  version: jest.fn().mockReturnValue(4),
}));

// ==================================================
// Mock window API
declare global {
  interface Window {
    animalAPI: {
      getAnimalDetails: jest.Mock;
    };
  }
}

window.animalAPI = {
  getAnimalDetails: jest.fn(),
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
    const mockAnimals: AnimalDetails[] = [
      {
        animalId: "random_uuid_1",
        flockPrefix: "Desert Where",
        name: "Boba Fett",
        registrationNumber: "12345",
        birthDate: "2019-05-02",
        coatColor: "Black",
      },
      {
        animalId: "random_uuid_2",
        flockPrefix: null,
        name: null,
        registrationNumber: null,
        birthDate: null,
        coatColor: null,
      },
    ];

    const mockResult = { ok: true, value: mockAnimals };
    (window.animalAPI.getAnimalDetails as jest.Mock).mockResolvedValueOnce(mockResult);

    (handleResult as jest.Mock).mockImplementation(async (res, handlers) => {
      handlers.success(mockAnimals);
    });

    render(<AnimalInformationTable animalIds={["random_uuid_1", "random_uuid_2"]} />);

    // Loading indicator should appear
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    // Wait for API call
    await waitFor(() => {
      expect(window.animalAPI.getAnimalDetails).toHaveBeenCalledWith(["random_uuid_1", "random_uuid_2"]);
    });

    // Check rendered table rows
    await waitFor(() => {
      expect(screen.getByText("12345")).toBeInTheDocument();
      expect(screen.getByText("Desert Where")).toBeInTheDocument();
      expect(screen.getByText("Boba Fett")).toBeInTheDocument();
      expect(screen.getByText("Black")).toBeInTheDocument();

      // Fallback placeholders for null/undefined values
      expect(screen.getAllByText("—").length).toBeGreaterThan(0);
    });
  });

  test("renders error message if handleResult returns error", async () => {

    const errorName = "Some Random DB Query Error Here"

    const mockResult = { ok: false, error: errorName };
    (window.animalAPI.getAnimalDetails as jest.Mock).mockResolvedValueOnce(mockResult);

    (handleResult as jest.Mock).mockImplementation(async (res, handlers) => {
      handlers.error(errorName);
    });

    render(<AnimalInformationTable animalIds={["bad-id"]} />);

    await waitFor(() => {
      expect(log.error).toHaveBeenCalledWith("Failed to get animalDetails:", errorName);
      expect(screen.getByText("Failed to load animal data.")).toBeInTheDocument();
    });
  });

  test("renders table rows correctly with normalized data using normalizeAnimals helper", () => {
    const input: AnimalDetails[] = [
      {
        animalId: "random_uuid_1",
        flockPrefix: null,
        name: null,
        registrationNumber: null,
        birthDate: null,
        coatColor: null,
      },
    ];

    const normalized = normalizeAnimals(input);

    expect(normalized).toEqual([
      {
        id: "random_uuid_1",
        flockPrefix: "—",
        name: "—",
        registrationNumber: "—",
        birthDate: "—",
        coatColor: "—",
      },
    ]);
  });
});
