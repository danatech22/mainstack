import api from "./api-client";
import type { User, Wallet, Transaction } from "../types/revenue";

export const userService = {
  getUser: () => api.get<User>("/user"),
};

export const walletService = {
  getWallet: () => api.get<Wallet>("/wallet"),
};

export const transactionService = {
  getTransactions: () => api.get<Transaction[]>("/transactions"),
};

const apiService = {
  user: userService,
  wallet: walletService,
  transactions: transactionService,
};

export default apiService;
