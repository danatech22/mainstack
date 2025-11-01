import { filterParsers } from "@/types/parsers";
import { useQueryStates } from "nuqs";

export function useTransactionFilters() {
  const [filters, setFilters] = useQueryStates(filterParsers);

  const getActiveFilterCount = () => {
    let count = 0;

    // Date range counts as 1 filter (both from and to together)
    if (filters.dateFrom || filters.dateTo) count++;
    if (filters.transactionType && filters.transactionType.length > 0) count++;
    if (filters.transactionStatus && filters.transactionStatus.length > 0)
      count++;
    if (filters.datePreset) count++;

    return count;
  };

  return {
    filters,
    setFilters,
    hasActiveFilters: Object.values(filters).some(Boolean),
    activeFilterCount: getActiveFilterCount(),
    clearFilters: () => {
      setFilters({
        dateFrom: null,
        dateTo: null,
        transactionType: null,
        transactionStatus: null,
        datePreset: null,
      });
    },
  };
}
