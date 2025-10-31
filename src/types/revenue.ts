export interface TransactionMetadata {
  name: string;
  type: "digital_product" | "coffee" | "webinar";
  email: string;
  quantity: number;
  country: string;
  product_name?: string;
}

export interface Transaction {
  amount: number;
  metadata?: TransactionMetadata;
  payment_reference?: string;
  status: "successful" | "pending" | "failed";
  type: "deposit" | "withdrawal";
  date: string;
}

export interface User {
  first_name: string;
  last_name: string;
  email: string;
}

export interface Wallet {
  balance: number;
  total_payout: number;
  total_revenue: number;
  pending_payout: number;
  ledger_balance: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface RevenueData {
  user: User;
  wallet: Wallet;
  transactions: Transaction[];
}
