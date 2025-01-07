import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { ExpenseCard } from "./components/expense/ExpenseCard";
import { IncomeCard } from "./components/expense/IncomeCard";

export function App() {
  return (
    <div className="w-screen h-screen p-6 pb-28 overflow-auto">
      <Tabs defaultValue="expense" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="expense">Расход</TabsTrigger>
          <TabsTrigger value="income">Доход</TabsTrigger>
        </TabsList>
        <TabsContent value="expense">
          <ExpenseCard />
        </TabsContent>
        <TabsContent value="income">
          <IncomeCard />
        </TabsContent>
      </Tabs>

      <Toaster />
    </div>
  );
}

export default App;
