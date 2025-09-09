/**
 * @jest-environment node
 */

import {
  dateAsString,
  dateTimeAsString,
  escapeLikeString,
  getDbDate,
} from "./dbUtils";

describe("dbUtils", () => {
  // -------------------
  // getStringDate tests
  // -------------------
  describe("dateAsString", () => {
    it("should return the correct string format for a given date", () => {
      const date = new Date("2023-05-15T12:34:56");
      expect(dateAsString(date)).toBe("2023-05-15");
    });

    it("should pad single digit month and day with leading zeros", () => {
      const date = new Date("2023-01-05T00:00:00");
      expect(dateAsString(date)).toBe("2023-01-05");
    });

    it("should default to today’s date if no argument is passed", () => {
      const today = new Date();
      const expected = `${today.getFullYear()}-${String(
        today.getMonth() + 1
      ).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
      expect(dateAsString()).toBe(expected);
    });
  });

  // ------------------------
  // getCurrentDateTime tests
  // ------------------------
  describe("dateTimeAsString", () => {
    it("should return correct datetime format for a given date", () => {
      const date = new Date("2023-05-15T08:09:07");
      expect(dateTimeAsString(date)).toBe("2023-05-15 08:09:07");
    });

    it("should pad hours, minutes, and seconds with leading zeros", () => {
      const date = new Date("2023-12-31T01:02:03");
      expect(dateTimeAsString(date)).toBe("2023-12-31 01:02:03");
    });

    it("should default to current datetime if no argument is passed", () => {
      const result = dateTimeAsString();
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
    });
  });

  // ----------------------
  // escapeLikeString tests
  // ----------------------
  describe("escapeLikeString", () => {
    it("should escape % characters", () => {
      expect(escapeLikeString("100%")).toBe("100\\%");
    });

    it("should escape _ characters", () => {
      expect(escapeLikeString("file_name")).toBe("file\\_name");
    });

    it("should escape both % and _ characters in a string", () => {
      expect(escapeLikeString("%foo_bar%")).toBe("\\%foo\\_bar\\%");
    });

    it("should return the same string if there are no special characters", () => {
      expect(escapeLikeString("hello world")).toBe("hello world");
    });
  });

  // ---------------
  // getDbDate tests
  // ---------------
  describe("getDbDate", () => {
    it("should parse a valid date string", () => {
      const result = getDbDate("2023-05-15");
      expect(result).toBeInstanceOf(Date);
      expect(result?.toISOString()).toBe("2023-05-15T00:00:00.000Z");
    });

    it("should return null for invalid format", () => {
      const spy = jest.spyOn(console, "error").mockImplementation(() => {});
      expect(getDbDate("15-05-2023")).toBeNull();
      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining("Invalid date format")
      );
      spy.mockRestore();
    });

    it("should return null for impossible date (e.g., Feb 30)", () => {
      const spy = jest.spyOn(console, "error").mockImplementation(() => {});
      expect(getDbDate("2023-02-30")).toBeNull();
      expect(spy).toHaveBeenCalledWith(
        expect.stringContaining("Invalid date components")
      );
      spy.mockRestore();
    });

    it("should handle leap year correctly (Feb 29, 2024)", () => {
      const result = getDbDate("2024-02-29");
      expect(result?.toISOString()).toBe("2024-02-29T00:00:00.000Z");
    });

    it("should return null for non-numeric values", () => {
      const spy = jest.spyOn(console, "error").mockImplementation(() => {});
      expect(getDbDate("20XX-01-01")).toBeNull();
      spy.mockRestore();
    });
  });
});
