import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { ExpenseCard } from "./components/ExpenseCard";
import { IncomeCard } from "./components/IncomeCard";
import { DataProvider } from "./context/SheetContext";
import { TransferCard } from "./components/TransferCard";

export function App() {
  return (
    <DataProvider>
      <div className="w-screen h-screen p-6 pb-28 overflow-auto">
        <Tabs defaultValue="expense" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="expense">Расход</TabsTrigger>
            <TabsTrigger value="income">Доход</TabsTrigger>
            <TabsTrigger value="transfer">Перевод</TabsTrigger>
          </TabsList>
          <TabsContent value="expense">
            <ExpenseCard />
          </TabsContent>
          <TabsContent value="income">
            <IncomeCard />
          </TabsContent>
          <TabsContent value="transfer">
            <TransferCard />
          </TabsContent>
        </Tabs>

        <Toaster />
      </div>
    </DataProvider>
  );
}

export default App;
