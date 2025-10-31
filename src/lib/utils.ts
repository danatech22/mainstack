import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
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

export function generateChartData(
  transactions: any[],
  startDate: string,
  endDate: string,
  dataPoints: number = 50
): { date: string; value: number }[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const data: { date: string; value: number }[] = [];

  let cumulativeBalance = 0;

  for (let i = 0; i < dataPoints; i++) {
    const progress = i / (dataPoints - 1);
    const currentDate = new Date(
      start.getTime() + progress * (end.getTime() - start.getTime())
    );

    // Calculate balance based on transactions up to this date
    const relevantTransactions = transactions.filter(
      (t) => new Date(t.date) <= currentDate
    );
    cumulativeBalance = relevantTransactions.reduce((sum, t) => {
      return sum + (t.type === "deposit" ? t.amount : -t.amount);
    }, 0);

    // Add some smooth variation
    const variation =
      Math.sin(progress * Math.PI * 2) * (cumulativeBalance * 0.1);

    data.push({
      date: currentDate.toISOString(),
      value: Math.max(0, cumulativeBalance + variation),
    });
  }

  return data;
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
