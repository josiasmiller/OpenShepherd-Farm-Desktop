/**
 * @jest-environment node
 */
import fs from "fs/promises";
import log from "electron-log";
import { transferParser } from "./transferParser";

import {
  MISSING_FIELDS,
  PARSE_ERROR,
  NEW_BUYER_NOT_SUPPORTED,
} from "@app/api";

// Mock only what the parser actually uses
jest.mock("fs/promises");
jest.mock("electron-log", () => ({
  error: jest.fn(),
}));

const mockFs = fs as jest.Mocked<typeof fs>;
const mockLog = log as jest.Mocked<typeof log>;

describe("transferParser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --------------------------------------------------------
  // 1. Missing required fields --> MISSING_FIELDS
  // --------------------------------------------------------
  test("returns MISSING_FIELDS when ANIMALS / SELLER / BUYER are missing", async () => {
    const badJson = {
      SELLER: {},
      BUYER: {},
    };

    mockFs.readFile.mockResolvedValueOnce(JSON.stringify(badJson));

    const result = await transferParser("/fake/path.json");

    expect(result.errorCode).toBe(MISSING_FIELDS);
    expect(result.data.animals).toEqual([]);
    expect(result.data.seller).toBeNull();
    expect(result.data.buyer).toBeNull();

    expect(result.warnings[0]).toMatch(/Invalid JSON: missing ANIMALS/);
  });

  // --------------------------------------------------------
  // 2. NEW BUYER --> returns NEW_BUYER_NOT_SUPPORTED
  // --------------------------------------------------------
  test("returns NEW_BUYER_NOT_SUPPORTED when buyer type is NEW", async () => {
    const json = {
      ANIMALS: [],
      SELLER: {
        CONTACT_ID: "",
        COMPANY_ID: "",
        PREMISE_ID: "",
        SOLD_AT: "",
        MOVED_AT: "",
      },
      BUYER: { TYPE: "NEW" },
    };

    mockFs.readFile.mockResolvedValueOnce(JSON.stringify(json));

    const result = await transferParser("/fake/path.json");

    expect(result.errorCode).toBe(NEW_BUYER_NOT_SUPPORTED);
    expect(result.data).toMatchObject({
      animals: [],
      seller: null,
      buyer: null,
    });
  });

  // --------------------------------------------------------
  // 3. Valid JSON --> parsed fields are returned correctly
  // --------------------------------------------------------
  test("parses valid JSON correctly", async () => {
    const json = {
      ANIMALS: [
        {
          ANIMAL_ID: "random_uuid_here",
          REGISTRATION_NUMBER: "124_000000123456",
          PREFIX: "Desert Where",
          NAME: "Boba Fett",
          BIRTH_DATE: "2020-01-01",
          BIRTH_TYPE: "Single",
          SEX: "Ram",
          COAT_COLOR: "Black",
        },
      ],
      SELLER: {
        CONTACT_ID: "SELLER_CONTACT_ID_HERE",
        COMPANY_ID: null,
        PREMISE_ID: "p1",
        SOLD_AT: "2025-11-01",
        MOVED_AT: "2025-11-02",
      },
      BUYER: {
        TYPE: "EXISTING",
        MEMBERSHIP_NUMBER: "12345",
        CONTACT_ID: "random_uuid_here",
        COMPANY_ID: null,
        PREMISE_ID: "random_uuid_here",
        FIRST_NAME: "Bob",
        LAST_NAME: "Bobbington",
        REGION: "Central",
      },
    };

    mockFs.readFile.mockResolvedValueOnce(JSON.stringify(json));

    const result = await transferParser("/fake/path.json");

    expect(result.errorCode).toBeUndefined();
    expect(result.warnings).toEqual([]);

    // Animals
    expect(result.data.animals[0].name).toBe("Boba Fett");
    expect(result.data.animals[0].registrationNumber).toBe("124_000000123456");

    // Seller
    expect(result.data.seller?.contactId).toBe("SELLER_CONTACT_ID_HERE");

    // Buyer
    expect(result.data.buyer).toMatchObject({
      membershipNumber: "12345",
      firstName: "Bob",
    });
  });

  // --------------------------------------------------------
  // 4. Invalid JSON → PARSE_ERROR
  // --------------------------------------------------------
  test("returns PARSE_ERROR when JSON parsing fails", async () => {
    mockFs.readFile.mockResolvedValueOnce("{ invalid json }");

    const result = await transferParser("/fake/path.json");

    expect(mockLog.error).toHaveBeenCalled();

    expect(result.errorCode).toBe(PARSE_ERROR);
    expect(result.warnings[0]).toMatch(/Failed to parse JSON/);
  });
});
