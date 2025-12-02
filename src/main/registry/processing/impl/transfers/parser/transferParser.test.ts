import log from "electron-log";
import { transferParser } from "./transferParser";

import {
  MISSING_FIELDS,
  NEW_BUYER_NOT_SUPPORTED,
  PARSE_ERROR,
  ExistingMemberBuyer,
  TransferError,
  TransferRecord,
} from "@app/api";

import { readJsonFile } from "@registryHelpers";
import { Failure, Success } from "@common/core";

// mock readJsonFile helper
jest.mock("@registryHelpers", () => ({
  readJsonFile: jest.fn(),
}));

const mockRead = readJsonFile as jest.Mock;
const mockLog = log as jest.Mocked<typeof log>;

describe("transferParser", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });


  // --------------------------------------------------------
  // 1. MissingFieldsError --> animals missing
  // --------------------------------------------------------
  test("returns MissingFieldsError when animals is missing", async () => {
    mockRead.mockResolvedValueOnce({ seller: {}, buyer: {} });

    const result = await transferParser("fake.json");

    expect(result.tag).toBe("error");
    expect(result).toBeInstanceOf(Failure);

    const err = (result as Failure<TransferError>).error;
    expect(err.type).toBe(MISSING_FIELDS);
    if (err.type === MISSING_FIELDS) {
      expect(err.missing).toContain("animals");
    }
  });

  // --------------------------------------------------------
  // 2. MissingFieldsError --> animals & buyer missing
  // --------------------------------------------------------
  test("returns MissingFieldsError when animals & buyer are missing", async () => {
    mockRead.mockResolvedValueOnce({ seller: {} });

    const result = await transferParser("fake.json");

    expect(result.tag).toBe("error");
    expect(result).toBeInstanceOf(Failure);

    const err = (result as Failure<TransferError>).error;
    expect(err.type).toBe(MISSING_FIELDS);
    if (err.type === MISSING_FIELDS) {
      expect(err.missing).toEqual(expect.arrayContaining(["animals", "buyer"]));
    }
  });

  // --------------------------------------------------------
  // 3. MissingFieldsError --> seller & buyer missing
  // --------------------------------------------------------
  test("returns MissingFieldsError when seller & buyer are missing", async () => {
    mockRead.mockResolvedValueOnce({ animals: [] });

    const result = await transferParser("fake.json");

    expect(result.tag).toBe("error");
    expect(result).toBeInstanceOf(Failure);

    const err = (result as Failure<TransferError>).error;
    expect(err.type).toBe(MISSING_FIELDS);
    if (err.type === MISSING_FIELDS) {
      expect(err.missing).toEqual(expect.arrayContaining(["seller", "buyer"]));
    }
  });


  // --------------------------------------------------------
  // 4. New Buyers are not currently supported
  // --------------------------------------------------------
  test("returns NewBuyerNotSupportedError when buyer type is NEW", async () => {
    mockRead.mockResolvedValueOnce({
      animals: [],
      seller: { identity: { type: "contact", id: "x" }, premiseId: "", soldAt: "", movedAt: "" },
      buyer: { type: "NEW" },
    });

    const result = await transferParser("fake.json");

    expect(result.tag).toBe("error");
    expect(result).toBeInstanceOf(Failure);

    const err = (result as Failure<TransferError>).error;
    expect(err.type).toBe(NEW_BUYER_NOT_SUPPORTED);
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
          coatColor: "Black" 
        }
      ],
      seller: { 
        identity: { 
          type: "contact", 
          id: "SELLER_ID" 
        }, 
        premiseId: "p1", 
        soldAt: "2025-11-01", 
        movedAt: "2025-11-02" 
      },
      buyer: { 
        type: "EXISTING", 
        identity: { 
          type: "contact", 
          id: "BUYER_ID" 
        }, 
        membershipNumber: "12345", 
        premiseId: "pr1", 
        firstName: "Bob", 
        lastName: "Smith", 
        region: "Central" 
      }
    });

    const result = await transferParser("fake.json");

    expect(result.tag).toBe("success");
    expect(result).toBeInstanceOf(Success);

    const rec = (result as Success<TransferRecord>).data;

    expect(rec.animals[0].name).toBe("Test Animal");
    expect(rec.seller.contactId).toBe("SELLER_ID");

    const buyer = rec.buyer as ExistingMemberBuyer;
    expect(buyer.membershipNumber).toBe("12345");
    expect(buyer.contactId).toBe("BUYER_ID");
  });


  // --------------------------------------------------------
  // 6. Invalid JSON --> PARSE_ERROR
  // --------------------------------------------------------
  test("returns PARSE_ERROR if readJsonFile throws", async () => {
    mockRead.mockRejectedValueOnce(new Error("bad json"));

    const result = await transferParser("fake.json");

    expect(mockLog.error).toHaveBeenCalled();

    expect(result.tag).toBe("error");
    expect(result).toBeInstanceOf(Failure);

    const err = (result as Failure<TransferError>).error;
    expect(err.type).toBe(PARSE_ERROR);
    if (err.type === PARSE_ERROR) {
      expect(err.details).toMatch(/bad json/);
    }
  });
});