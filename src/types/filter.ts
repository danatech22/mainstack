import { z } from "zod";

// Filter schema
export const transactionFilterSchema = z.object({
  dateRange: z
    .object({
      from: z.string().optional(),
      to: z.string().optional(),
    })
    .optional(),
  transactionType: z.array(z.string()).optional(),
  transactionStatus: z.array(z.string()).optional(),
  datePreset: z
    .enum(["today", "last7days", "thisMonth", "last3months"])
    .optional(),
});

export type TransactionFilterValues = z.infer<typeof transactionFilterSchema>;

// Transaction types - matching your design
export const TRANSACTION_TYPES = [
  { value: "store", label: "Store Transactions" },
  { value: "tipped", label: "Get Tipped" },
  { value: "withdrawals", label: "Withdrawals" },
  { value: "chargebacks", label: "Chargebacks" },
  { value: "cashbacks", label: "Cashbacks" },
  { value: "refer", label: "Refer & Earn" },
] as const;

export const TRANSACTION_STATUSES = [
  { value: "successful", label: "Successful" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
] as const;

export const DATE_PRESETS = [
  { value: "today", label: "Today" },
  { value: "last7days", label: "Last 7 days" },
  { value: "thisMonth", label: "This month" },
  { value: "last3months", label: "Last 3 months" },
] as const;
