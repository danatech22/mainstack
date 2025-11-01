import { useState } from "react";
import { Header } from "./components/layout/header";
import { NavIcon } from "./components/layout/side-nav-icon";
import { BalanceCard } from "./components/review/balance-card";
import { TransactionList } from "./components/review/transaction-list";

function App() {
  const [activeIcon, setActiveIcon] = useState<string | null>(null);
  return (
    <div className="w-full bg-white min-h-svh">
      <div className="flex fixed top-1/2 -translate-y-1/2 left-5 flex-col gap-4 p-2 bg-white rounded-full shadow-[0px_2px_4px_0px_rgba(45,59,67,0.05),inset_0px_2px_4px_0px_rgba(45,59,67,0.05)]">
        <NavIcon
          icon="link"
          isActive={activeIcon === "link"}
          onClick={() => setActiveIcon("link")}
        />
        <NavIcon
          icon="layers"
          isActive={activeIcon === "layers"}
          onClick={() => setActiveIcon("layers")}
        />
        <NavIcon
          icon="grid"
          isActive={activeIcon === "grid"}
          onClick={() => setActiveIcon("grid")}
        />
        <NavIcon
          icon="document"
          isActive={activeIcon === "document"}
          onClick={() => setActiveIcon("document")}
        />
      </div>
      <Header />
      <BalanceCard />
      <TransactionList />
    </div>
  );
}

export default App;
