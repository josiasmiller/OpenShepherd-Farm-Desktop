import "@testing-library/jest-dom";
import { render, screen, waitFor, act } from "@testing-library/react";
import React from "react";
import log from "electron-log/renderer";

import { AnimalInformationTable, normalizeAnimals } from "./animalTable";
import { Result, Success, Failure } from "@common/core";
import { AnimalDetails } from "@app/api";

// ==================================================
// Constants for tests
const animalIdOne = '994cc9b6-8694-4332-a9b0-37a0b5d7d52c';
const animalIdTwo = 'd55a9c86-c8d0-4cc8-a3aa-40de2749a714';

// ==================================================
// mock the logger
jest.mock("electron-log/renderer", () => ({
  error: jest.fn(),
}));

// ==================================================
// Define a typed AnimalAPI interface for tests
interface AnimalAPI {
  getAnimalDetails: (animalIds: string[]) => Promise<Result<AnimalDetails[], string>>;
}

// ==================================================
// Create a typed mock implementation
const mockAnimalAPI: AnimalAPI = {
  getAnimalDetails: jest.fn(),
};

// ==================================================
// Assign to window
declare global {
  interface Window {
    animalAPI: AnimalAPI;
  }
}
window.animalAPI = mockAnimalAPI;

// ==================================================
describe("AnimalInformationTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });


  test("renders 'No animal data found.' when no animalIds are provided", () => {
    render(<AnimalInformationTable animalIds={[]} />);
    expect(screen.getByText("No animal data found.")).toBeInTheDocument();
  });

  test("renders table rows with normalized data", async () => {
    const numberEmDashes = 2; // how many em dashes are included due to invalid data

    const mockAnimals: AnimalDetails[] = [
      {
        animalId: animalIdOne,
        flockPrefix: "Desert Where",
        name: "Boba Fett",
        registrationNumber: "12345",
        birthDate: "2019-05-02",
        coatColor: "Black",
      },
      {
        animalId: animalIdTwo,
        flockPrefix: "",
        name: "",
        registrationNumber: null,
        birthDate: "",
        coatColor: "",
      },
    ];

    mockAnimalAPI.getAnimalDetails = jest.fn().mockResolvedValue(new Success(mockAnimals));

    render(<AnimalInformationTable animalIds={[animalIdOne, animalIdTwo]} />);

    // Wait for table to update
    expect(await screen.findByText("12345")).toBeInTheDocument();
    expect(await screen.findByText("Desert Where")).toBeInTheDocument();
    expect(await screen.findByText("Boba Fett")).toBeInTheDocument();
    expect(await screen.findByText("Black")).toBeInTheDocument();

    // Fallback placeholders
    expect(await screen.findAllByText("—")).toHaveLength(numberEmDashes);
  });


  test("renders error message if API returns error", async () => {
    const errorMessage = "Some Random DB Query Error Here";

    mockAnimalAPI.getAnimalDetails = jest.fn().mockResolvedValue(
      new Failure(errorMessage)
    );

    render(<AnimalInformationTable animalIds={["bad-id"]} />);

    await waitFor(() => {
      expect(log.error)
        .toHaveBeenCalledWith("Failed to get animalDetails:", errorMessage);

      expect(screen.getByText("Failed to load animal data."))
        .toBeInTheDocument();
    });
  });

  test("renders table rows correctly with normalized data using normalizeAnimals helper", () => {
    const input: AnimalDetails[] = [
      {
        animalId: animalIdOne,
        flockPrefix: "",
        name: "",
        registrationNumber: null,
        birthDate: "",
        coatColor: "",
      },
    ];

    const normalized = normalizeAnimals(input);

    expect(normalized).toEqual([
      {
        id: animalIdOne,
        flockPrefix: "",
        name: "",
        registrationNumber: "—",
        birthDate: "—",
        coatColor: "",
      },
    ]);
  });

  // ==================================================
  // Extra Columns & Column Order Tests
  // ==================================================

  test("renders extra columns correctly", async () => {
    const mockAnimals: AnimalDetails[] = [
      { animalId: animalIdOne, flockPrefix: "F", name: "A", registrationNumber: "123", birthDate: "2020-01-01", coatColor: "Black" }
    ];

    mockAnimalAPI.getAnimalDetails = jest.fn().mockResolvedValue(new Success(mockAnimals));

    await act(async () => {
      render(<AnimalInformationTable animalIds={[animalIdOne]} extraColumns={[
        { key: "extraInfo", header: "Extra Info", getValue: (id: string) => `Extra-${id}` },
      ]} />);
    });

    expect(await screen.findByText("Extra Info")).toBeInTheDocument();
    expect(await screen.findByText(`Extra-${animalIdOne}`)).toBeInTheDocument();
  });


  test("renders columns in custom columnOrder", async () => {
    const mockAnimals: AnimalDetails[] = [
      { animalId: animalIdOne, flockPrefix: "F", name: "A", registrationNumber: "123", birthDate: "2020-01-01", coatColor: "Black" }
    ];

    mockAnimalAPI.getAnimalDetails = jest.fn().mockResolvedValue(new Success(mockAnimals));

    await act(async () => {
      render(<AnimalInformationTable animalIds={[animalIdOne]} columnOrder={["name", "registrationNumber", "flockPrefix", "birthDate", "coatColor"]} />);
    });

    // Verify headers rendered in the correct order
    const headers = screen.getAllByRole("columnheader").map(th => th.textContent);
    expect(headers).toEqual(["Animal Name", "Registration Number", "Flock Prefix", "Birth Date", "Coat Color"]);
  });


  test("throws error when columnOrder has duplicates", () => {
    const columnOrder = ["name", "name", "registrationNumber", "flockPrefix", "birthDate", "coatColor"];
    expect(() => render(<AnimalInformationTable animalIds={[animalIdOne]} columnOrder={columnOrder} />))
        .toThrow(/columnOrder contains duplicates/);
  });


  test("throws error when columnOrder contains unknown keys", () => {
    const columnOrder = ["name", "registrationNumber", "flockPrefix", "birthDate", "coatColor", "unknownKey"];
    expect(() => render(<AnimalInformationTable animalIds={[animalIdOne]} columnOrder={columnOrder} />))
        .toThrow(/columnOrder contains unknown key "unknownKey"/);
  });


  test("throws error when columnOrder does not include all columns", () => {
    const columnOrder = ["name", "registrationNumber", "flockPrefix"];
    expect(() => render(<AnimalInformationTable animalIds={[animalIdOne]} columnOrder={columnOrder} />))
        .toThrow(/columnOrder must include all columns/);
  });


});
