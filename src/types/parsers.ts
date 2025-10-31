import { parseAsString, parseAsArrayOf, createSerializer } from "nuqs";

// URL state parsers
export const filterParsers = {
  dateFrom: parseAsString,
  dateTo: parseAsString,
  transactionType: parseAsArrayOf(parseAsString),
  transactionStatus: parseAsArrayOf(parseAsString),
  datePreset: parseAsString,
};

// Serializer for programmatic updates
export const filterSerializer = createSerializer(filterParsers);
