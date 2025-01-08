import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSheetData } from "@/hooks/use-sheet-data";
import { cn, SHEET_URL } from "@/lib/utils";

export function OperationsCard() {
  const { operations } = useSheetData();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Операции</CardTitle>
        <CardDescription>
          Здесь можно посмотреть все операции
          <br />
          <a target="_blank" href={SHEET_URL} className="text-blue-400">
            Ссылка на таблицу
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Дата</TableHead>
              <TableHead className="text-right">Сумма</TableHead>
              <TableHead>Категория</TableHead>
              <TableHead>Счет</TableHead>
              <TableHead>Комментарий</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {operations.map((operation, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{operation.date}</TableCell>
                <TableCell
                  className={cn(
                    "font-medium text-right",
                    operation.income ? "text-green-500" : "text-red-500"
                  )}
                >
                  {`${operation.income ? "+" : "-"}${operation.amount}`}
                </TableCell>
                <TableCell className="text-slate-500">
                  {operation.category}
                </TableCell>
                <TableCell className="text-slate-500">
                  {operation.account}
                </TableCell>
                <TableCell className="text-gray-400">
                  {operation.comment}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
