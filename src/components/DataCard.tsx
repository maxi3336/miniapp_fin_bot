import { useMemo, useState } from "react";
import { SHEET_URL } from "@/lib/utils";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import { useSheetData } from "@/hooks/use-sheet-data";

const KSU_CELLS = ["G7", "G8", "G9", "G10", "G11", "G12"];
const EXCLUDE_CELLS = ["G3", "G4"];

type IOpen = { ksu: boolean; max: boolean };
type IAccount = { name: string; amount: string };
type IAccounts = {
  ksu: { total: number; accounts: IAccount[] };
  max: { total: number; accounts: IAccount[] };
};

const NamesMap: Record<keyof IAccounts, string> = {
  ksu: "Ксюша",
  max: "Максим",
};

function getAmount(amount: number): string {
  return (
    amount.toLocaleString("ru-RU", {
      minimumFractionDigits: 2,
    }) + "₽"
  );
}

export function DataCard() {
  const { accounts } = useSheetData();

  const values = useMemo<IAccounts>(() => {
    const data: IAccounts = {
      ksu: { total: 0, accounts: [] },
      max: { total: 0, accounts: [] },
    };

    Object.keys(accounts).forEach((cell) => {
      const acc = accounts[cell];
      const amount = getAmount(acc[1]);
      const account: IAccount = { name: acc[0], amount };
      const key: keyof IAccounts = KSU_CELLS.includes(cell) ? "ksu" : "max";

      data[key].accounts.push(account);
      if (!EXCLUDE_CELLS.includes(cell)) {
        data[key].total += acc[1];
      }
    });

    return data;
  }, [accounts]);

  const [open, setOpen] = useState<IOpen>({
    ksu: false,
    max: false,
  });

  const handleOpen = (key: keyof IOpen) => () => {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Данные</CardTitle>
        <CardDescription>
          <a target="_blank" href={SHEET_URL} className="text-blue-400">
            Ссылка на таблицу
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg mb-1">Счета</h3>
          <div className="space-y-3">
            {Object.keys(values).map((key) => (
              <Collapsible
                key={key}
                className="w-full"
                open={open[key as keyof IOpen]}
                onOpenChange={handleOpen(key as keyof IOpen)}
              >
                <CollapsibleTrigger className="w-full">
                  <Button
                    variant="secondary"
                    className="w-full flex justify-between"
                    size="sm"
                  >
                    {NamesMap[key as keyof IAccounts]}
                    <ChevronsUpDown className="h-4 w-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Счет</TableHead>
                        <TableHead className="text-right">Сумма</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {values[key as keyof IAccounts].accounts.map((acc) => (
                        <TableRow key={acc.name}>
                          <TableCell className="font-medium">
                            {acc.name}
                          </TableCell>
                          <TableCell className="text-slate-500 text-right">
                            {acc.amount}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                    <TableFooter>
                      <TableRow>
                        <TableCell>Всего</TableCell>
                        <TableCell className="text-right">
                          {getAmount(values[key as keyof IAccounts].total)}
                        </TableCell>
                      </TableRow>
                    </TableFooter>
                  </Table>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
