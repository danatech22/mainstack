import { Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionItem } from "./transaction-item";
import { useTransactions } from "@/api/hooks";
import { FilterSheet } from "./filter-sheet";

export function TransactionList() {
  const { data: transactions, isLoading } = useTransactions();

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500">
        Loading transactions...
      </div>
    );
  }

  const transactionList = transactions || [];
  return (
    <div className="max-w-290 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#131316] tracking-tighter">
            {transactionList.length} Transactions
          </h2>
          <p className="text-sm text-[#56616B] font-medium tracking-tighter mt-1">
            Your transactions for the last 7 days
          </p>
        </div>
        <div className="flex items-center gap-3">
          <FilterSheet>
            <Button
              variant="secondary"
              size="lg"
              className="w-27 h-12 rounded-full text-base text-[#131316] font-semibold tracking-tighter"
            >
              <span className="">Filter</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </FilterSheet>
          <Button
            variant="secondary"
            size="sm"
            className="w-35 h-12 rounded-full text-base text-[#131316] font-semibold tracking-tighter"
          >
            <Download className="w-4 h-4" />
            <span className="">Export list</span>
          </Button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="">
        {transactionList.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No transactions found
          </div>
        ) : (
          transactionList.map((transaction, index) => (
            <TransactionItem
              key={transaction.payment_reference || `transaction-${index}`}
              transaction={transaction}
            />
          ))
        )}
      </div>
    </div>
  );
}
