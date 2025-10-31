import { Button } from "@/components/ui/button";

import { formatCurrency } from "@/lib/utils";

import type { Wallet } from "@/types/revenue";
import { StatCard } from "./stat-card";
import { BalanceChart } from "./balance-chart";

interface BalanceCardProps {
  wallet: Wallet;
  chartData: any[];
  onWithdraw: () => void;
}

export function BalanceCard({
  wallet,
  chartData,
  onWithdraw,
}: BalanceCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
      {/* Top Section */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-sm text-gray-500 mb-2">Available Balance</p>
          <h1 className="text-[42px] font-bold leading-none tracking-tight">
            {formatCurrency(wallet.balance)}
          </h1>
        </div>
        <Button
          onClick={onWithdraw}
          size="lg"
          className="bg-black hover:bg-gray-800 text-white px-8 rounded-full h-11"
        >
          Withdraw
        </Button>
      </div>

      {/* Chart */}
      <div className="mb-8 -mx-2">
        <BalanceChart
          data={chartData}
          startDate="2022-04-01"
          endDate="2022-04-30"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <StatCard
          label="Ledger Balance"
          amount={wallet.ledger_balance}
          tooltip="Your current ledger balance"
        />
        <StatCard
          label="Total Payout"
          amount={wallet.total_payout}
          tooltip="Total amount paid out"
        />
        <StatCard
          label="Total Revenue"
          amount={wallet.total_revenue}
          tooltip="Total revenue generated"
        />
        <StatCard
          label="Pending Payout"
          amount={wallet.pending_payout}
          tooltip="Payouts waiting to be processed"
        />
      </div>
    </div>
  );
}
