/**
 * @jest-environment node
 */
import fs from "fs/promises";
import { transferParser } from "./transferParser";

jest.mock("fs/promises");
jest.mock("electron", () => ({
  dialog: {
    showOpenDialog: jest.fn(),
  },
}));

import { dialog } from "electron";

const mockFs = fs as jest.Mocked<typeof fs>;
const mockDialog = dialog as jest.Mocked<typeof dialog>;

describe("transferParser", () => {
  // silence console logs/ err logs to reduce noice when running tests
  beforeAll(() => {
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("returns CANCELLED_DIALOG when user cancels file selection", async () => {
    mockDialog.showOpenDialog.mockResolvedValueOnce({
      canceled: true,
      filePaths: [],
    });

    const result = await transferParser();

    expect(result.errorCode).toBe("CANCELLED_DIALOG");
    expect(result.data.animals).toEqual([]);
    expect(result.data.seller).toBeNull();
    expect(result.data.buyer).toBeNull();
  });

  test("returns MISSING_FIELDS when required fields are missing", async () => {
    mockDialog.showOpenDialog.mockResolvedValueOnce({
      canceled: false,
      filePaths: ["/fake/path.json"],
    });

    mockFs.readFile.mockResolvedValueOnce(JSON.stringify({ SELLER: {}, BUYER: {} }));

    const result = await transferParser();

    expect(result.errorCode).toBe("MISSING_FIELDS");
    expect(result.warnings[0]).toMatch(/Invalid JSON: missing ANIMALS/);
  });

  test("returns NEW_BUYER_NOT_SUPPORTED when buyer type is NEW", async () => {
    const json = {
      ANIMALS: [],
      SELLER: { CONTACT_ID: "", COMPANY_ID: "", PREMISE_ID: "", SOLD_AT: "", MOVED_AT: "" },
      BUYER: { TYPE: "NEW" },
    };

    mockDialog.showOpenDialog.mockResolvedValueOnce({
      canceled: false,
      filePaths: ["/fake/path.json"],
    });

    mockFs.readFile.mockResolvedValueOnce(JSON.stringify(json));

    const result = await transferParser();

    expect(result.errorCode).toBe("NEW_BUYER_NOT_SUPPORTED");
  });

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

    mockDialog.showOpenDialog.mockResolvedValueOnce({
      canceled: false,
      filePaths: ["/fake/path.json"],
    });

    mockFs.readFile.mockResolvedValueOnce(JSON.stringify(json));

    const result = await transferParser();

    expect(result.errorCode).toBeUndefined();
    expect(result.warnings).toEqual([]);
    expect(result.data.animals[0].name).toBe("Boba Fett");
    expect(result.data.seller.contactId).toBe("SELLER_CONTACT_ID_HERE");
    expect(result.data.buyer).toMatchObject({
      membershipNumber: "12345",
      firstName: "Bob",
    });
  });

  test("returns PARSE_ERROR when JSON is invalid", async () => {
    mockDialog.showOpenDialog.mockResolvedValueOnce({
      canceled: false,
      filePaths: ["/fake/path.json"],
    });

    mockFs.readFile.mockResolvedValueOnce("{ invalid json }");

    const result = await transferParser();

    expect(result.errorCode).toBe("PARSE_ERROR");
    expect(result.warnings[0]).toMatch(/Failed to parse JSON/);
  });
});
