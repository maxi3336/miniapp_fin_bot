import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSheetData } from "@/hooks/use-sheet-data";

export function MainTabs() {
  const { loading } = useSheetData();

  return (
    <TabsList className="grid w-full grid-cols-4">
      <TabsTrigger value="action" disabled={loading}>
        Действие
      </TabsTrigger>
      <TabsTrigger value="transfer" disabled={loading}>
        Перевод
      </TabsTrigger>
      <TabsTrigger value="operations" disabled={loading}>
        Операции
      </TabsTrigger>
      <TabsTrigger value="data" disabled={loading}>
        Данные
      </TabsTrigger>
    </TabsList>
  );
}
