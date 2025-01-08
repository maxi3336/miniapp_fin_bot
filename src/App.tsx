import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from "@/components/ui/toaster";
import { SheetProvider } from "./SheetContext";
import { TransferCard } from "@/components/TransferCard";
import { ActionCard } from "@/components/ActionCard";
import { DataCard } from "@/components/DataCard";
import { OperationsCard } from "@/components/OperationsCard";

function App() {
  return (
    <SheetProvider>
      <div className="w-screen h-screen p-6 pb-28 overflow-auto">
        <Tabs defaultValue="action" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="action">Действие</TabsTrigger>
            <TabsTrigger value="transfer">Перевод</TabsTrigger>
            <TabsTrigger value="operations">Операции</TabsTrigger>
            <TabsTrigger value="data">Данные</TabsTrigger>
          </TabsList>
          <TabsContent value="action">
            <ActionCard />
          </TabsContent>
          <TabsContent value="transfer">
            <TransferCard />
          </TabsContent>
          <TabsContent value="operations">
            <OperationsCard />
          </TabsContent>
          <TabsContent value="data">
            <DataCard />
          </TabsContent>
        </Tabs>

        <Toaster />
      </div>
    </SheetProvider>
  );
}

export default App;
