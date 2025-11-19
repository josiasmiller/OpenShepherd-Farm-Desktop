import "@testing-library/jest-dom";
import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import log from "electron-log/renderer";

import { OwnerInformationTable, normalizeOwners, OwnerInfo } from "./ownerTable";
import { unwrapOrThrow } from "@common/core";
import { Owner, OwnerType, Contact, Company, Premise, State } from "@app/api";

// ==================================================
// MOCKS
jest.mock("electron-log/renderer", () => ({
  error: jest.fn(),
}));

jest.mock("@common/core", () => ({
  unwrapOrThrow: jest.fn(),
}));

// ==================================================
// Mock window API
declare global {
  interface Window {
    lookupAPI: {
      getOwnerById: jest.Mock;
    };
  }
}

window.lookupAPI = {
  getOwnerById: jest.fn(),
};

// ==================================================
// Dummy data

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
    contact: { id: "random_owner_uuid_1", firstName: "John", lastName: "Doe" },
    flockId: "F1",
    phoneNumber: "555-1234",
    premise: dummyPremiseOne,
    scrapieId: { scrapieName: "SCR-001" },
  } as Owner,
  {
    type: OwnerType.COMPANY,
    company: { id: "random_owner_uuid_2", name: "Acme Corp" },
    flockId: null,
    phoneNumber: null,
    premise: dummyPremiseTwo,
    scrapieId: null,
  } as Owner,
];

describe("OwnerInformationTable", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock unwrapOrThrow to just return the value
    (unwrapOrThrow as jest.Mock).mockImplementation(async (val) => val);

    // Mock getOwnerById to return owner by id/type
    (window.lookupAPI.getOwnerById as jest.Mock).mockImplementation(
        async (id: string, type: OwnerType) => {
          const owner = mockOwners.find((o) => {
            if (type === OwnerType.CONTACT && o.type === OwnerType.CONTACT) {
              return o.contact.id === id;
            } else if (type === OwnerType.COMPANY && o.type === OwnerType.COMPANY) {
              return o.company.id === id;
            }
            return false;
          });
          return owner;
        }
      );
  });

  test("renders 'No owner data found.' when no owners are provided", () => {
    render(<OwnerInformationTable owners={[]} />);
    expect(screen.getByText("No owner data found.")).toBeInTheDocument();
  });

  test("renders loading state then table rows with normalized owner data", async () => {
    render(
      <OwnerInformationTable
        owners={[
          { ownerId: "random_owner_uuid_1", ownerType: OwnerType.CONTACT },
          { ownerId: "random_owner_uuid_2", ownerType: OwnerType.COMPANY },
        ]}
      />
    );

    // Loading indicator appears
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    // Wait for API calls
    await waitFor(() => {
      expect(window.lookupAPI.getOwnerById).toHaveBeenCalledWith("random_owner_uuid_1", OwnerType.CONTACT);
      expect(window.lookupAPI.getOwnerById).toHaveBeenCalledWith("random_owner_uuid_2", OwnerType.COMPANY);
    });

    // Wait for table to render
    await waitFor(() => {
      // Contact owner
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("F1")).toBeInTheDocument();
      expect(screen.getByText("555-1234")).toBeInTheDocument();
      expect(screen.getByText("SCR-001")).toBeInTheDocument();
      expect(screen.getByText("123 Main St")).toBeInTheDocument();

      // Company owner
      expect(screen.getByText("Acme Corp")).toBeInTheDocument();
      expect(screen.getAllByText("—").length).toBeGreaterThanOrEqual(2); // flockId / phoneNumber / scrapieId fallback
    });
  });

  test("renders error message if getOwnerById fails", async () => {
    const errorMsg = "API failed";
    (window.lookupAPI.getOwnerById as jest.Mock).mockRejectedValueOnce(new Error(errorMsg));

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
        id: "random_owner_uuid_1",
        type: OwnerType.CONTACT,
        name: "John Doe",
        flockId: "F1",
        phoneNumber: "555-1234",
        scrapieId: "SCR-001",
        premise: "123 Main St",
      },
      {
        id: "random_owner_uuid_2",
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
