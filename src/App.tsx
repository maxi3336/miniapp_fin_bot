import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/toaster";
import { ExpenseCard } from "./components/expense/ExpenseCard";
import { IncomeCard } from "./components/expense/IncomeCard";
import { DataProvider } from "./context/SheetContext";

export function App() {
  const handleAddData = async () => {
    try {
      await fetch("http://localhost:5001/api/append-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          range: "Главная!F2",
          values: [["ТЕСТ!!!"]],
        }),
      });
    } catch (error) {
      console.error("Ошибка добавления данных:", error);
    }
  };

  return (
    <DataProvider>
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
    </DataProvider>
  );
}

export default App;
