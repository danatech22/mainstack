import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  parseISO,
  isSameDay,
  subDays,
  startOfMonth,
  subMonths,
  startOfYear,
  format,
} from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    currencyDisplay: "code",
  }).format(amount);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(date);
}

export function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  const month = date.toLocaleDateString("en-US", { month: "short" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

export function getTransactionTitle(transaction: any): string {
  if (transaction.type === "withdrawal") {
    return "Cash withdrawal";
  }

  if (transaction.metadata?.product_name) {
    return transaction.metadata.product_name;
  }

  if (transaction.metadata?.type === "coffee") {
    return "Buy me a coffee";
  }

  return "Payment received";
}

export function getTransactionSubtitle(transaction: any): string {
  if (transaction.type === "withdrawal") {
    return transaction.status === "successful" ? "Successful" : "Pending";
  }

  return transaction.metadata?.name || "Unknown";
}

export function getDateRangeDescriptor(
  from: string | null | undefined,
  to: string | null | undefined
): string {
  const today = new Date();

  if (!from && !to) {
    return "All Time";
  }

  if (from && to) {
    const fromDate = parseISO(from);
    const toDate = parseISO(to);

    if (isSameDay(toDate, today)) {
      if (isSameDay(fromDate, today)) {
        return "Today";
      }
      if (isSameDay(fromDate, subDays(today, 7))) {
        return "the last 7 days";
      }
      if (isSameDay(fromDate, startOfMonth(today))) {
        return "This Month";
      }
      if (isSameDay(fromDate, subMonths(today, 3))) {
        return "the last 3 months";
      }
      if (isSameDay(fromDate, startOfYear(today))) {
        return "This Year";
      }
    }

    if (isSameDay(fromDate, toDate)) {
      if (isSameDay(fromDate, subDays(today, 1))) {
        return "Yesterday";
      }
      return `on ${format(fromDate, "MMM d, yyyy")}`;
    }

    const fromFormatted = format(fromDate, "MMM d, yyyy");
    const toFormatted = format(toDate, "MMM d, yyyy");
    return `from ${fromFormatted} to ${toFormatted}`;
  }

  if (from && !to) {
    return `since ${format(parseISO(from), "MMM d, yyyy")}`;
  }
  if (!from && to) {
    return `up to ${format(parseISO(to), "MMM d, yyyy")}`;
  }

  return "All Time";
}
