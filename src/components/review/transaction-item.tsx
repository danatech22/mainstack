import { ArrowDownLeft, ArrowUpRight } from "lucide-react";

import {
  formatCurrency,
  formatDate,
  cn,
  getTransactionTitle,
  getTransactionSubtitle,
} from "@/lib/utils";
import type { Transaction } from "@/types/revenue";

interface TransactionItemProps {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: TransactionItemProps) {
  const isWithdrawal = transaction.type === "withdrawal";
  const isPending = transaction.status === "pending";
  const isSuccessful = transaction.status === "successful";

  const title = getTransactionTitle(transaction);
  const subtitle = getTransactionSubtitle(transaction);

  return (
    <div className="flex items-center gap-4 py-4">
      {/* Icon */}
      <div
        className={cn(
          "flex items-center justify-center w-12 h-12 rounded-full shrink-0",
          isWithdrawal
            ? isPending
              ? "bg-red-50"
              : "bg-red-50"
            : "bg-emerald-50"
        )}
      >
        {isWithdrawal ? (
          <ArrowUpRight strokeWidth={1.5} className="w-5 h-5 text-red-500" />
        ) : (
          <ArrowDownLeft
            strokeWidth={1.5}
            className="w-5 h-5 text-emerald-500"
          />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="font-medium  text-[#131316] truncate tracking-tighter">
          {title}
        </div>
        <div
          className={cn(
            "text-sm mt-0.5 truncate font-medium",

            isWithdrawal && isPending ? "text-yellow-600" : "text-[#56616B]",
            isWithdrawal && isSuccessful ? "text-emerald-600" : "text-[#56616B]"
          )}
        >
          {subtitle}
        </div>
      </div>

      {/* Amount and Date */}
      <div className="text-right shrink-0">
        <div className="font-bold tracking-tighter text-[#131316]">
          {isWithdrawal ? "-" : ""}
          {formatCurrency(transaction.amount)}
        </div>
        <div className="text-sm text-[#56616B] font-medium mt-0.5">
          {formatDate(transaction.date)}
        </div>
      </div>
    </div>
  );
}
