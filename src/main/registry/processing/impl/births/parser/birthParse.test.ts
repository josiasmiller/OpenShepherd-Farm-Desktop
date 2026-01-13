import { birthParser, selectAndParseBirths } from "./birthParser";

import { readJsonFile } from "@registryHelpers";
import { selectJsonFile } from "@fileDialogs/jsonSelect";
import { findBirthMissingFields } from "./helpers/findBirthMissingFields";

import { Failure, Success } from "@common/core";

import {
  BirthRecord,
  MISSING_FIELDS,
  MissingFieldsError,
  PARSE_ERROR,
  ParseError,
} from "@app/api";
import { BrowserWindow } from "electron";

// ---------------------------------------------
// Mock dependencies
// ---------------------------------------------
jest.mock("@registryHelpers", () => ({
  readJsonFile: jest.fn(),
}));

jest.mock("@fileDialogs/jsonSelect", () => ({
  selectJsonFile: jest.fn(),
}));

jest.mock("./helpers/findBirthMissingFields", () => ({
  findBirthMissingFields: jest.fn(),
}));

const mockRead = readJsonFile as jest.Mock;
const mockSelect = selectJsonFile as jest.Mock;
const mockMissing = findBirthMissingFields as jest.Mock;

describe("birthParser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns MissingFieldsError when required fields are missing", async () => {
    mockRead.mockResolvedValueOnce({}); // whatever is read
    mockMissing.mockReturnValueOnce(["births"]); // simulate missing

    const result = await birthParser("fake.json");

    expect(result.tag).toBe("error");
    expect(result).toBeInstanceOf(Failure);

    const err = (result as Failure<MissingFieldsError>).error;
    expect(err.type).toBe(MISSING_FIELDS);
    expect(err.missing).toContain("births");
  });

  test("parses valid birth JSON correctly", async () => {
    const mockJson = {
      births: [
        {
          breeder: { key: "341164cf-9e59-42d8-b1c8-0bfc170302d5", value: "Breeder 1" },
          isStillborn: false,
          animalName: "Lamb 1",
          sex: {
            key: "23c415a7-b60f-4231-8cfc-c205a79faef3",
            value: "Ram"
          },

          birth: {
            date: "2024-02-01",
            type: {
              key: "3323b31f-c478-4d2b-abfe-1fa12e73e32a",
              value: "Single"
            },
            service: {
              key: "dadd0840-cf4e-4257-867d-7e8a525edcf5",
              value: "Natural"
            },
            notes: "Some birth notes",
          },

          parents: {
            sireId: "sire123",
            damId: "dam456",
          },

          prefix: {
            key: "acb8f9a7-3aee-46b7-b4ea-99dd3e5fbdee",
            value: "Prefix"
          },

          tags: {
            federal: {
              type: { key: "d13a17a0-33c9-4590-850c-63a07d504993", value: "Federal Scrapie" },
              color: { key: "709c3963-bbe6-4524-bc9d-a0fc3b754e68", value: "Yellow" },
              location: { key: "7969cccf-0c6f-49ab-ba1d-9a9b7f2012b1", value: "Right Ear" },
              number: "F123",
            },
            farm: {
              type: { key: "6af3845e-0abc-4afa-bcb4-4eea96f2ecc2", value: "Farm" },
              color: { key: "3b64185d-24cb-4fda-923e-301cc5b1e72e", value: "Blue" },
              location: { key: "7969cccf-0c6f-49ab-ba1d-9a9b7f2012b1", value: "Right Ear" },
              number: "A777",
            },
          },

          weight: {
            value: 5.3,
            units: { key: "8c8ac721-84d3-4358-902c-1c78771d04d6", value: "Kilograms" },
          },

          coatColor: {
            key: "9217b3ff-d94f-4b8b-90e9-6513fd3740e3",
            value: "Black",
            tableKey: "0972486b-7b99-427e-b942-fa5ec88c2678",
          },
        },
      ],
    };

    mockRead.mockResolvedValueOnce(mockJson);
    mockMissing.mockReturnValueOnce([]); // no missing fields

    const result = await birthParser("fake.json");

    expect(result.tag).toBe("success");
    expect(result).toBeInstanceOf(Success);

    const data = (result as Success<BirthRecord>).data;

    expect(data.rows.length).toBe(1);

    const row = data.rows[0];
    expect(row.animalName).toBe("Lamb 1");
    expect(row.sex.name).toBe("Ram");
    expect(row.fedNum).toBe("F123");
    expect(row.farmNum).toBe("A777");
  });

  test("returns PARSE_ERROR if readJsonFile throws", async () => {
    mockRead.mockRejectedValueOnce(new Error("bad json"));
    mockMissing.mockReturnValueOnce([]);

    const result = await birthParser("fake.json");

    expect(result.tag).toBe("error");
    expect(result).toBeInstanceOf(Failure);

    const err = (result as Failure<ParseError>).error;

    expect(err.type).toBe(PARSE_ERROR);
    expect(err.details).toMatch(/bad json/);
  });
});


describe("selectAndParseBirths", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("calls birthParser when a file is selected", async () => {
    mockSelect.mockResolvedValueOnce("some/path.json");

    mockRead.mockResolvedValueOnce({ births: [] });
    mockMissing.mockReturnValueOnce([]);

    const win = {} as BrowserWindow;

    const result = await selectAndParseBirths(win);

    expect(mockSelect).toHaveBeenCalled();

    expect(result.tag).toBe("success");
    expect(result).toBeInstanceOf(Success);
  });
});
