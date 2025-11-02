import { Button } from "@/components/ui/button";

import { formatCurrency } from "@/lib/utils";
import { StatCard } from "./stat-card";
import { BalanceChart } from "./balance-chart";
import { useTransactions, useWallet } from "@/api/hooks";

export function BalanceCard() {
  const { data: wallet, isLoading } = useWallet();
  const { data: transactions } = useTransactions();
  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500">Loading Wallet...</div>
    );
  }
  return (
    <div className="bg-white max-w-290 mx-auto mb-28 flex justify-between">
      <div className="w-8/12">
        <div className="flex items-start gap-20 mb-8">
          <div>
            <p className="text-sm mb-2 text-[#56616B] tracking-tighter font-medium">
              Available Balance
            </p>
            <h1 className="text-4xl font-bold leading-none text-[#131316] tracking-tight">
              {formatCurrency(wallet!.balance)}
            </h1>
          </div>
          <Button
            size="lg"
            className="bg-[#131316] w-44 hover:bg-gray-800 text-white px-8 rounded-full h-14"
          >
            Withdraw
          </Button>
        </div>

        {/* Chart */}
        <div className="">
          <BalanceChart transactions={transactions} />
        </div>
      </div>

      {/* Stats  */}
      <div className="w-1/5 space-y-8">
        <StatCard
          label="Ledger Balance"
          amount={wallet!.ledger_balance}
          tooltip="Your current ledger balance"
        />
        <StatCard
          label="Total Payout"
          amount={wallet!.total_payout}
          tooltip="Total amount paid out"
        />
        <StatCard
          label="Total Revenue"
          amount={wallet!.total_revenue}
          tooltip="Total revenue generated"
        />
        <StatCard
          label="Pending Payout"
          amount={wallet!.pending_payout}
          tooltip="Payouts waiting to be processed"
        />
      </div>
    </div>
  );
}
