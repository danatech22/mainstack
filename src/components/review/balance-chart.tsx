import { useMemo } from "react";
import { Line, LineChart, XAxis } from "recharts";
import { format, parseISO } from "date-fns";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";

interface BalanceChartProps {
  transactions?: Array<{
    amount: number;
    type: "deposit" | "withdrawal";
    status: string;
    date: string;
  }>;
}

const chartConfig = {
  balance: {
    label: "Balance",
    color: "#FF5403",
  },
} satisfies ChartConfig;

export function BalanceChart({ transactions = [] }: BalanceChartProps) {
  const chartData = useMemo(() => {
    if (!transactions.length) return [];

    // Sort transactions by date
    const sortedTransactions = [...transactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Calculate running balance for each day
    let runningBalance = 0;
    const dailyBalances = new Map<string, number>();

    sortedTransactions.forEach((transaction) => {
      if (transaction.status === "successful") {
        if (transaction.type === "deposit") {
          runningBalance += transaction.amount;
        } else if (transaction.type === "withdrawal") {
          runningBalance -= transaction.amount;
        }
        dailyBalances.set(transaction.date, runningBalance);
      }
    });

    // Convert to array format for chart
    return Array.from(dailyBalances.entries()).map(([date, balance]) => ({
      date,
      balance,
      fullDate: format(parseISO(date), "MMM dd, yyyy"),
    }));
  }, [transactions]);

  // Get tick positions (only first and last)
  const customTicks = useMemo(() => {
    if (chartData.length === 0) return [];
    return [chartData[0].date, chartData[chartData.length - 1].date];
  }, [chartData]);

  if (chartData.length === 0) {
    return (
      <div className="relative w-full h-64 flex items-center justify-center text-muted-foreground">
        No transaction data available
      </div>
    );
  }

  return (
    <div className="relative w-full">
      <ChartContainer className="h-64 w-full" config={chartConfig}>
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={true}
            tickMargin={8}
            ticks={customTicks}
            tickFormatter={(value) => format(parseISO(value), "MMM")}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(_, payload) => {
                  if (payload && payload[0]) {
                    return payload[0].payload.fullDate;
                  }
                  return "";
                }}
                formatter={(value) => [
                  `$${Number(value).toFixed(2)}`,
                  " Balance",
                ]}
              />
            }
          />
          <Line
            dataKey="balance"
            type="natural"
            stroke="var(--color-balance)"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
}
