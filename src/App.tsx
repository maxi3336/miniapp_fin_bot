import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { DataProvider } from "./context/SheetContext";
import { TransferCard } from "./components/TransferCard";
import { OperationCard } from "./components/OperationCard";

export function App() {
  return (
    <DataProvider>
      <div className="w-screen h-screen p-6 pb-28 overflow-auto">
        <Tabs defaultValue="operation" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="operation">Операция</TabsTrigger>
            <TabsTrigger value="transfer">Перевод</TabsTrigger>
          </TabsList>
          <TabsContent value="operation">
            <OperationCard />
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
