import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import log from "electron-log/renderer";

import { OwnerInformationTable, normalizeOwners, OwnerInfo } from "./ownerTable";
import { Owner, OwnerType, Contact, Company, Premise, State } from "@app/api";
import { Result, Success, Failure } from "@common/core";


// ==================================================
// Constants / Dummy Data

const ownerIdOne = "2a1c0682-01af-41b4-b620-1f5c50a10dc9";
const ownerIdTwo = "d3ca296e-7cd0-4345-8023-61898da4cd99";

const dummyState: State = {
  id: "random_state_uuid_1",
  name: "Colorado",
  abbreviation: "CO",
  display_order: 1,
  country_id: "random_country_uuid_1",
} as State;

const dummyPremiseOne: Premise = {
  id: "p1",
  address: "123 Main St",
  city: "Metropolis",
  state: dummyState,
  postcode: "12345",
  country: "USA",
};

const dummyPremiseTwo: Premise = {
  id: "p2",
  address: "567 Location Address Street",
  city: "Boulder",
  state: dummyState,
  postcode: "54321",
  country: "USA",
};

const mockOwners: Owner[] = [
  {
    type: OwnerType.CONTACT,
    contact: { id: ownerIdOne, firstName: "John", lastName: "Doe" },
    flockId: "F1",
    phoneNumber: "555-1234",
    premise: dummyPremiseOne,
    scrapieId: { scrapieName: "SCR-001" },
  } as Owner,
  {
    type: OwnerType.COMPANY,
    company: { id: ownerIdTwo, name: "Acme Corp" },
    flockId: null,
    phoneNumber: null,
    premise: dummyPremiseTwo,
    scrapieId: null,
  } as Owner,
];

// ==================================================
// Mock logger
jest.mock("electron-log/renderer", () => ({
  error: jest.fn(),
}));

// ==================================================
// Define a typed LookupAPI interface
interface LookupAPI {
  getOwnerById: (id: string, type: OwnerType) => Promise<Result<Owner, string>>;
}

// ==================================================
// Create a typed mock implementation
const mockLookupAPI: LookupAPI = {
  getOwnerById: jest.fn(),
};

// Assign to window
declare global {
  interface Window {
    lookupAPI: LookupAPI;
  }
}
window.lookupAPI = mockLookupAPI;

// ==================================================
describe("OwnerInformationTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementation
    mockLookupAPI.getOwnerById = jest.fn(async (id: string, type: OwnerType) => {
      const owner = mockOwners.find((o) => {
        if (type === OwnerType.CONTACT && o.type === OwnerType.CONTACT) {
          return o.contact.id === id;
        } else if (type === OwnerType.COMPANY && o.type === OwnerType.COMPANY) {
          return o.company.id === id;
        }
        return false;
      });

      if (!owner) return new Failure("Owner not found");
      return new Success(owner);
    });
  });

  test("renders 'No owner data found.' when no owners are provided", () => {
    render(<OwnerInformationTable owners={[]} />);
    expect(screen.getByText("No owner data found.")).toBeInTheDocument();
  });

  test("renders loading state then table rows with normalized data", async () => {
    render(
      <OwnerInformationTable
        owners={[
          { ownerId: ownerIdOne, ownerType: OwnerType.CONTACT },
          { ownerId: ownerIdTwo, ownerType: OwnerType.COMPANY },
        ]}
      />
    );

    // Loading indicator appears
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    // Wait for table cells to render
    expect(await screen.findByText("John Doe")).toBeInTheDocument();
    expect(await screen.findByText("F1")).toBeInTheDocument();
    expect(await screen.findByText("555-1234")).toBeInTheDocument();
    expect(await screen.findByText("SCR-001")).toBeInTheDocument();
    expect(await screen.findByText("123 Main St")).toBeInTheDocument();

    expect(await screen.findByText("Acme Corp")).toBeInTheDocument();

    const allEmDashes = await screen.findAllByText("—");
    expect(allEmDashes.length).toBeGreaterThanOrEqual(2);
  });

  test("renders error message if getOwnerById fails", async () => {
    const errorMsg = "Some Random Error Message";
    mockLookupAPI.getOwnerById = jest.fn().mockRejectedValueOnce(new Error(errorMsg));

    render(<OwnerInformationTable owners={[{ ownerId: "bad", ownerType: OwnerType.CONTACT }]} />);

    await waitFor(() => {
      expect(log.error).toHaveBeenCalledWith("Error fetching owner data:", errorMsg);
      expect(screen.getByText("Failed to load owner data.")).toBeInTheDocument();
    });
  });

  test("normalizeOwners helper works correctly", () => {
    const input: Owner[] = mockOwners;
    const normalized: OwnerInfo[] = normalizeOwners(input);

    expect(normalized).toEqual([
      {
        id: ownerIdOne,
        type: OwnerType.CONTACT,
        name: "John Doe",
        flockId: "F1",
        phoneNumber: "555-1234",
        scrapieId: "SCR-001",
        premise: "123 Main St",
      },
      {
        id: ownerIdTwo,
        type: OwnerType.COMPANY,
        name: "Acme Corp",
        flockId: "—",
        phoneNumber: "—",
        scrapieId: "—",
        premise: "567 Location Address Street",
      },
    ]);
  });
});
