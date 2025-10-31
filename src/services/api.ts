import type { RevenueData } from "@/types/revenue";

// Mock data - replace with actual API calls
const mockData: RevenueData = {
  user: {
    first_name: "Olivier",
    last_name: "Jones",
    email: "olivierjones@gmail.com",
  },
  wallet: {
    balance: 750.56,
    total_payout: 500,
    total_revenue: 1250.56,
    pending_payout: 0,
    ledger_balance: 500,
  },
  transactions: [
    {
      amount: 500,
      metadata: {
        name: "John Doe",
        type: "digital_product",
        email: "johndoe@example.com",
        quantity: 1,
        country: "Nigeria",
        product_name: "Rich Dad Poor Dad",
      },
      payment_reference: "c3f7123f-186f-4a45-b911-76736e9c5937",
      status: "successful",
      type: "deposit",
      date: "2022-03-03",
    },
    {
      amount: 400,
      metadata: {
        name: "Fibi Brown",
        type: "coffee",
        email: "fibibrown@example.com",
        quantity: 8,
        country: "Ireland",
      },
      payment_reference: "d28db158-0fc0-40cd-826a-4243923444f7",
      status: "successful",
      type: "deposit",
      date: "2022-03-02",
    },
    {
      amount: 350.56,
      metadata: {
        name: "Delvan Ludacris",
        type: "webinar",
        email: "johndoe@example.com",
        quantity: 1,
        country: "Kenya",
        product_name: "How to build an online brand",
      },
      payment_reference: "73f45bc0-8f41-4dfb-9cae-377a32b71d1e",
      status: "successful",
      type: "deposit",
      date: "2022-03-01",
    },
    {
      amount: 300,
      status: "successful",
      type: "withdrawal",
      date: "2022-03-01",
    },
    {
      amount: 300,
      metadata: {
        name: "Shawn kane",
        type: "webinar",
        email: "shawnkane@example.com",
        quantity: 1,
        country: "United Kingdom",
        product_name: "Support my outreach",
      },
      payment_reference: "c22055e5-8f47-4059-a1e9-51124d325992",
      status: "successful",
      type: "deposit",
      date: "2022-02-28",
    },
    {
      amount: 200,
      status: "successful",
      type: "withdrawal",
      date: "2022-03-01",
    },
    {
      amount: 200,
      metadata: {
        name: "Ada Eze",
        type: "webinar",
        email: "adaeze1@example.com",
        quantity: 1,
        country: "Nigeria",
        product_name: "Learn how to pitch your idea",
      },
      payment_reference: "5b2988d9-395e-4a91-984b-8b02f0d12df9",
      status: "successful",
      type: "deposit",
      date: "2022-02-20",
    },
  ],
};

export async function fetchRevenueData(): Promise<RevenueData> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockData);
    }, 500);
  });
}

export async function withdrawFunds(
  amount: number
): Promise<{ success: boolean; message: string }> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: `Successfully withdrew $${amount.toFixed(2)}`,
      });
    }, 1000);
  });
}
