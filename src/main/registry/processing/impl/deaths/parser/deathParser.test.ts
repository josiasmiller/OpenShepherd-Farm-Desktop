import log from "electron-log";
import { deathParser } from "./deathParser";

import {
    MISSING_FIELDS,
    PARSE_ERROR,
    type MissingFieldsError,
    type ParseError,
    DeathRecord
} from "@app/api";

import { readJsonFile } from "@registryHelpers";
import { Failure, Success } from "@common/core";

// mock readJsonFile helper
jest.mock("@registryHelpers", () => ({
    readJsonFile: jest.fn(),
}));

const mockRead = readJsonFile as jest.Mock;
const mockLog = log as jest.Mocked<typeof log>;

describe("deathParser", () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // --------------------------------------------------------
    // 1. MissingFieldsError --> deaths missing
    // --------------------------------------------------------
    test("returns MissingFieldsError when deaths is missing", async () => {
        mockRead.mockResolvedValueOnce({});

        const result = await deathParser("fake.json");

        expect(result.tag).toBe("error");
        expect(result).toBeInstanceOf(Failure);

        const err = (result as Failure<MissingFieldsError>).error;
        expect(err.type).toBe(MISSING_FIELDS);
        if (err.type === MISSING_FIELDS) {
            expect(err.missing).toContain("deaths");
        }
    });

    // --------------------------------------------------------
    // 2. MissingFieldsError --> deaths not an array
    // --------------------------------------------------------
    test("returns MissingFieldsError when deaths is not an array", async () => {
        mockRead.mockResolvedValueOnce({ deaths: {} });

        const result = await deathParser("fake.json");

        expect(result.tag).toBe("error");
        expect(result).toBeInstanceOf(Failure);

        const err = (result as Failure<MissingFieldsError>).error;
        expect(err.type).toBe(MISSING_FIELDS);
        if (err.type === MISSING_FIELDS) {
            expect(err.missing).toContain("deaths");
        }
    });

    // --------------------------------------------------------
    // 3. Valid JSON --> success
    // --------------------------------------------------------
    test("parses valid JSON correctly", async () => {
        mockRead.mockResolvedValueOnce({
            deaths: [
                {
                    deathDate: "2024-10-01",
                    animalId: "some_random_uuid",
                    registrationNumber: "12345",
                    prefixKey: "PK",
                    prefix: "P",
                    name: "Test Animal",
                    reasonKey: "OLD",
                    reason: "Old age",
                    notes: "Some notes"
                }
            ]
        });

        const result = await deathParser("fake.json");

        expect(result.tag).toBe("success");
        expect(result).toBeInstanceOf(Success);

        const record = (result as Success<DeathRecord>).data;

        expect(record.deaths.length).toBe(1);

        const death = record.deaths[0];
        expect(death.name).toBe("Test Animal");
        expect(death.reason).toBe("Old age");
    });

    // --------------------------------------------------------
    // 4. Invalid JSON --> PARSE_ERROR
    // --------------------------------------------------------
    test("returns PARSE_ERROR if readJsonFile throws", async () => {
        mockRead.mockRejectedValueOnce(new Error("bad json"));

        const result = await deathParser("fake.json");

        expect(mockLog.error).toHaveBeenCalled();

        expect(result.tag).toBe("error");
        expect(result).toBeInstanceOf(Failure);

        const err = (result as Failure<ParseError>).error;
        expect(err.type).toBe(PARSE_ERROR);
        if (err.type === PARSE_ERROR) {
            expect(err.details).toMatch(/bad json/);
        }
    });
});
