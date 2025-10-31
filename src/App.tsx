import { useUser } from "./api/hooks";
import { Header } from "./components/layout/header";
import { TransactionList } from "./components/review/transaction-list";

function App() {
  const { data } = useUser();
  console.log(data?.first_name); // ✅ TypeScript autocomplete
  return (
    <div className="w-full bg-white min-h-svh">
      <Header />
      <TransactionList />
    </div>
  );
}

export default App;
