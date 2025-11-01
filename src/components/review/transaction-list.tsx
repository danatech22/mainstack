import { Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionItem } from "./transaction-item";
import { useTransactions } from "@/api/hooks";
import { FilterSheet } from "./filter-sheet";
import { useTransactionFilters } from "@/hooks/use-filter";
import { getDateRangeDescriptor } from "@/lib/utils";

export function TransactionList() {
  const { filters, clearFilters, activeFilterCount } = useTransactionFilters();
  const { data: transactions, isLoading } = useTransactions();

  if (isLoading) {
    return (
      <div className="text-center py-12 text-gray-500">
        Loading transactions...
      </div>
    );
  }

  // Filter transactions based on URL filters
  const filteredTransactions = (transactions || []).filter((transaction) => {
    if (filters.dateFrom || filters.dateTo) {
      const transactionDate = new Date(transaction.date);

      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom);
        if (transactionDate < fromDate) return false;
      }

      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        toDate.setDate(toDate.getDate() + 1);
        if (transactionDate >= toDate) return false;
      }
    }

    // Transaction type filter
    if (filters.transactionType && filters.transactionType.length > 0) {
      const typeMap: Record<string, string> = {
        store: "deposit",
        tipped: "deposit",
        withdrawals: "withdrawal",
        chargebacks: "chargeback",
        cashbacks: "cashback",
        refer: "referral",
      };

      const mappedTypes = filters.transactionType.map((t) => typeMap[t]);
      if (!mappedTypes.includes(transaction.type)) return false;
    }

    // Transaction status filter
    if (filters.transactionStatus && filters.transactionStatus.length > 0) {
      if (!filters.transactionStatus.includes(transaction.status)) return false;
    }

    return true;
  });

  const dateText = getDateRangeDescriptor(filters.dateFrom, filters.dateTo);

  const transactionList = filteredTransactions;

  const handleClear = () => {
    clearFilters();
  };

  return (
    <div className="max-w-290 mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[#131316] tracking-tighter">
            {transactionList.length} Transactions
          </h2>
          <p className="text-sm text-[#56616B] font-medium tracking-tighter mt-1">
            Your transactions for {dateText}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <FilterSheet>
            <Button
              variant="secondary"
              size="lg"
              className="min-w-27 h-12 rounded-full text-base text-[#131316] font-semibold tracking-tighter"
            >
              <span className="">Filter</span>
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center ml-1 bg-[#131316] text-white text-xs font-bold rounded-full w-5 h-5">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown className="w-4 h-4 ml-1" />
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
          <div className="max-w-98 mx-auto py-12">
            <img
              src="/src/assets/not-found-icon.svg"
              className="size-14 object-contain"
              alt="mainstack logo"
            />
            <h2 className="text-3xl font-bold tracking-tighter mt-4 text-[#131316]">
              No matching transaction found for the selected filter
            </h2>
            <p className="font-medium text-[#56616B] mt-2">
              Change your filters to see more results, or add a new product.
            </p>
            <Button
              type="button"
              variant="secondary"
              onClick={handleClear}
              className="w-30 rounded-full mt-10 h-12 text-[#131316] text-base font-semibold tracking-tighter"
            >
              Clear
            </Button>
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
