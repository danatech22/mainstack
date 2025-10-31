import { useQuery } from "@tanstack/react-query";
import type { UseQueryOptions } from "@tanstack/react-query";
import { userService, walletService, transactionService } from "./services";
import type { User, Wallet, Transaction } from "../types/revenue";

// Query keys
export const queryKeys = {
  user: ["user"] as const,
  wallet: ["wallet"] as const,
  transactions: ["transactions"] as const,
};

// User Hook
export const useUser = (
  options?: Omit<UseQueryOptions<User, Error>, "queryKey" | "queryFn">
) => {
  return useQuery<User, Error>({
    queryKey: queryKeys.user,
    queryFn: userService.getUser,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

// Wallet Hook
export const useWallet = (
  options?: Omit<UseQueryOptions<Wallet, Error>, "queryKey" | "queryFn">
) => {
  return useQuery<Wallet, Error>({
    queryKey: queryKeys.wallet,
    queryFn: walletService.getWallet,
    staleTime: 1 * 60 * 1000,
    ...options,
  });
};

// Transactions Hook
export const useTransactions = (
  options?: Omit<UseQueryOptions<Transaction[], Error>, "queryKey" | "queryFn">
) => {
  return useQuery<Transaction[], Error>({
    queryKey: queryKeys.transactions,
    queryFn: transactionService.getTransactions,
    staleTime: 30 * 1000,
    ...options,
  });
};
