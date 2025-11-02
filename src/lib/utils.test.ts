import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  cn,
  formatCurrency,
  formatDate,
  formatShortDate,
  getTransactionTitle,
  getTransactionSubtitle,
  getDateRangeDescriptor,
} from "./utils";

describe("cn", () => {
  it("should merge class names correctly", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("should handle conditional classes", () => {
    expect(cn("foo", false && "bar", "baz")).toBe("foo baz");
  });

  it("should handle tailwind merge conflicts", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("should handle empty inputs", () => {
    expect(cn()).toBe("");
  });
});

describe("formatCurrency", () => {
  it("should format positive amounts correctly", () => {
    const result = formatCurrency(1234.56);
    expect(result).toContain("USD");
    expect(result).toContain("1,234.56");
  });

  it("should format zero correctly", () => {
    const result = formatCurrency(0);
    expect(result).toContain("USD");
    expect(result).toContain("0.00");
  });

  it("should format negative amounts correctly", () => {
    const result = formatCurrency(-999.99);
    expect(result).toContain("USD");
    expect(result).toContain("999.99");
  });

  it("should format large amounts with proper separators", () => {
    const result = formatCurrency(1234567.89);
    expect(result).toContain("USD");
    expect(result).toContain("1,234,567.89");
  });

  it("should always show 2 decimal places", () => {
    const result1 = formatCurrency(100);
    expect(result1).toContain("100.00");
    const result2 = formatCurrency(100.5);
    expect(result2).toContain("100.50");
  });
});

describe("formatDate", () => {
  it("should format date string correctly", () => {
    const result = formatDate("2024-01-15T00:00:00.000Z");
    expect(result).toMatch(/Jan 15, 2024|Jan 14, 2024/); // Account for timezone
  });

  it("should handle different date formats", () => {
    const result = formatDate("2024-12-25");
    expect(result).toMatch(/Dec 25, 2024|Dec 24, 2024/);
  });
});

describe("formatShortDate", () => {
  it("should format date with short month name", () => {
    const result = formatShortDate("2024-03-20T00:00:00.000Z");
    expect(result).toMatch(/Mar (19|20), 2024/);
  });

  it("should handle single digit days", () => {
    const result = formatShortDate("2024-05-05T00:00:00.000Z");
    expect(result).toMatch(/May (4|5), 2024/);
  });
});

describe("getTransactionTitle", () => {
  it('should return "Cash withdrawal" for withdrawal type', () => {
    const transaction = { type: "withdrawal" };
    expect(getTransactionTitle(transaction)).toBe("Cash withdrawal");
  });

  it("should return product name if available in metadata", () => {
    const transaction = {
      type: "deposit",
      metadata: { product_name: "Premium Subscription" },
    };
    expect(getTransactionTitle(transaction)).toBe("Premium Subscription");
  });

  it('should return "Buy me a coffee" for coffee type', () => {
    const transaction = {
      type: "deposit",
      metadata: { type: "coffee" },
    };
    expect(getTransactionTitle(transaction)).toBe("Buy me a coffee");
  });

  it('should return "Payment received" as default', () => {
    const transaction = { type: "deposit" };
    expect(getTransactionTitle(transaction)).toBe("Payment received");
  });

  it("should prioritize product_name over coffee type", () => {
    const transaction = {
      type: "deposit",
      metadata: { product_name: "Course", type: "coffee" },
    };
    expect(getTransactionTitle(transaction)).toBe("Course");
  });
});

describe("getTransactionSubtitle", () => {
  it('should return "Successful" for successful withdrawal', () => {
    const transaction = {
      type: "withdrawal",
      status: "successful",
    };
    expect(getTransactionSubtitle(transaction)).toBe("Successful");
  });

  it('should return "Pending" for pending withdrawal', () => {
    const transaction = {
      type: "withdrawal",
      status: "pending",
    };
    expect(getTransactionSubtitle(transaction)).toBe("Pending");
  });

  it("should return metadata name for non-withdrawal", () => {
    const transaction = {
      type: "deposit",
      metadata: { name: "John Doe" },
    };
    expect(getTransactionSubtitle(transaction)).toBe("John Doe");
  });

  it('should return "Unknown" when no metadata name', () => {
    const transaction = {
      type: "deposit",
      metadata: {},
    };
    expect(getTransactionSubtitle(transaction)).toBe("Unknown");
  });

  it('should return "Unknown" when no metadata', () => {
    const transaction = { type: "deposit" };
    expect(getTransactionSubtitle(transaction)).toBe("Unknown");
  });
});

describe("getDateRangeDescriptor", () => {
  beforeEach(() => {
    // Mock the current date to 2024-11-01 for consistent testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-11-01T12:00:00Z"));
  });

  it('should return "All Time" when both dates are null', () => {
    expect(getDateRangeDescriptor(null, null)).toBe("All Time");
  });

  it('should return "All Time" when both dates are undefined', () => {
    expect(getDateRangeDescriptor(undefined, undefined)).toBe("All Time");
  });

  it('should return "Today" when both dates are today', () => {
    const today = "2024-11-01";
    expect(getDateRangeDescriptor(today, today)).toBe("Today");
  });

  it('should return "Yesterday" when date is yesterday', () => {
    const yesterday = "2024-10-31";
    expect(getDateRangeDescriptor(yesterday, yesterday)).toBe("Yesterday");
  });

  it('should return "the last 7 days" for 7 days ago to today', () => {
    const sevenDaysAgo = "2024-10-25";
    const today = "2024-11-01";
    expect(getDateRangeDescriptor(sevenDaysAgo, today)).toBe("the last 7 days");
  });

  it("should return custom range format for arbitrary dates", () => {
    const from = "2024-10-01";
    const to = "2024-10-15";
    const result = getDateRangeDescriptor(from, to);
    expect(result).toMatch(/from .* to .*/);
  });

  it('should handle "from" date only', () => {
    const from = "2024-09-15";
    const result = getDateRangeDescriptor(from, null);
    expect(result).toMatch(/^since /);
  });

  it('should handle "to" date only', () => {
    const to = "2024-10-20";
    const result = getDateRangeDescriptor(null, to);
    expect(result).toMatch(/^up to /);
  });

  it("should format single non-yesterday date correctly", () => {
    const date = "2024-10-20";
    const result = getDateRangeDescriptor(date, date);
    expect(result).toMatch(/^on /);
  });
});
