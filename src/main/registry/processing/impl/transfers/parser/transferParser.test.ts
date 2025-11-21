import log from "electron-log";
import { transferParser } from "./transferParser";
import {
  MISSING_FIELDS,
  PARSE_ERROR,
  NEW_BUYER_NOT_SUPPORTED,
  ExistingMemberBuyer,
} from "@app/api";

// mock readJsonFile helper
jest.mock("@main/registry/processing/helpers/registryHelpers", () => ({
  readJsonFile: jest.fn(),
}));

jest.mock("electron-log", () => ({ error: jest.fn() }));

import { readJsonFile } from "@main/registry/processing/helpers/registryHelpers";
const mockRead = readJsonFile as jest.Mock;
const mockLog = log as jest.Mocked<typeof log>;

describe("transferParser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --------------------------------------------------------
  // 1. Missing animals 
  // --------------------------------------------------------
  test("returns MISSING_FIELDS when animals is missing", async () => {
    mockRead.mockResolvedValueOnce({ seller: {}, buyer: {} });

    const result = await transferParser("fake.json");

    expect(result.errorCode).toBe(MISSING_FIELDS);
    expect(result.data).toMatchObject({ animals: [], seller: null, buyer: null });
    expect(result.warnings[0]).toMatch(/Invalid JSON: missing animals/);
  });

  // --------------------------------------------------------
  // 2. Missing animals / buyer
  // --------------------------------------------------------
  test("returns MISSING_FIELDS when animals & buyer are missing", async () => {
    mockRead.mockResolvedValueOnce({ seller: {}, });

    const result = await transferParser("fake.json");

    expect(result.errorCode).toBe(MISSING_FIELDS);
    expect(result.data).toMatchObject({ animals: [], seller: null, buyer: null });
    expect(result.warnings[0]).toMatch(/Invalid JSON: missing animals, buyer/);
  });

  // --------------------------------------------------------
  // 3. Missing buyer / seller
  // --------------------------------------------------------
  test("returns MISSING_FIELDS when buyer & seller are missing", async () => {
    mockRead.mockResolvedValueOnce({ animals: [], });

    const result = await transferParser("fake.json");

    expect(result.errorCode).toBe(MISSING_FIELDS);
    expect(result.data).toMatchObject({ animals: [], seller: null, buyer: null });
    expect(result.warnings[0]).toMatch(/Invalid JSON: missing seller, buyer/);
  });



  // --------------------------------------------------------
  // 4. NEW buyer --> NEW_BUYER_NOT_SUPPORTED
  // --------------------------------------------------------
  test("returns NEW_BUYER_NOT_SUPPORTED when buyer type is NEW", async () => {
    mockRead.mockResolvedValueOnce({
      animals: [],
      seller: {
        identity: { type: "contact", id: "x" },
        premiseId: "",
        soldAt: "",
        movedAt: "",
      },
      buyer: { type: "NEW" },
    });

    const result = await transferParser("fake.json");
    expect(result.errorCode).toBe(NEW_BUYER_NOT_SUPPORTED);
    expect(result.data).toEqual({ animals: [], seller: null, buyer: null });
  });


  // --------------------------------------------------------
  // 5. Valid JSON
  // --------------------------------------------------------
  test("parses valid JSON correctly", async () => {
    mockRead.mockResolvedValueOnce({
      animals: [
        {
          animalId: "uuid",
          registrationNumber: "123",
          prefix: "Prefix",
          name: "Test Animal",
          birthDate: "2020-01-01",
          birthType: "Single",
          sex: "Ram",
          coatColor: "Black",
        },
      ],
      seller: {
        identity: { type: "contact", id: "SELLER_ID" },
        premiseId: "p1",
        soldAt: "2025-11-01",
        movedAt: "2025-11-02",
      },
      buyer: {
        type: "EXISTING",
        identity: { type: "contact", id: "BUYER_ID" },
        membershipNumber: "12345",
        premiseId: "pr1",
        firstName: "Bob",
        lastName: "Smith",
        region: "Central",
      },
    });

    const result = await transferParser("fake.json");

    expect(result.errorCode).toBeUndefined();
    expect(result.warnings).toEqual([]);

    expect(result.data.animals[0].name).toBe("Test Animal");
    expect(result.data.seller?.contactId).toBe("SELLER_ID");

    const buyer = result.data.buyer as ExistingMemberBuyer;
    expect(buyer.membershipNumber).toBe("12345");

  });

  // --------------------------------------------------------
  // 6. Invalid JSON --> PARSE_ERROR
  // --------------------------------------------------------
  test("returns PARSE_ERROR if readJsonFile throws", async () => {
    mockRead.mockRejectedValueOnce(new Error("bad json"));

    const result = await transferParser("fake.json");

    expect(mockLog.error).toHaveBeenCalled();
    expect(result.errorCode).toBe(PARSE_ERROR);
    expect(result.warnings[0]).toMatch(/Failed to parse JSON/);
  });
});
