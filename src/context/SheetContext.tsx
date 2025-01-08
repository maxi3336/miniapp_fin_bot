import { createContext, useContext, useState, useEffect } from "react";
import { API_GET } from "@/lib/utils";

const ACCOUNTS_URL = API_GET + "Главная!G3:H14";
const INCOME_URL = API_GET + "Доходы!A2:A9";
const EXPENSE_URL = API_GET + "Расходы!A2:A16";

type ISheetRes = Array<[string]>;
type IAccountsRes = Array<[string, string]>;

type IAccounts = Record<string, [string, number]>;

interface SheetContextType {
  accounts: IAccounts;
  incomes: string[];
  expenses: string[];
  loading: boolean;
  error: Error | null;
}

const DataContext = createContext<SheetContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<IAccounts>({});
  const [incomes, setIncomes] = useState<string[]>([]);
  const [expenses, setExpenses] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const urls = [ACCOUNTS_URL, INCOME_URL, EXPENSE_URL];

      const responses = await Promise.all(urls.map((url) => fetch(url)));
      const [acc, inc, exp] = (await Promise.all(
        responses.map((response) => response.json())
      )) as [IAccountsRes, ISheetRes, ISheetRes];

      setIncomes(inc.map((x: string[]) => x[0]));
      setExpenses(exp.map((x: string[]) => x[0]));

      const result = acc.reduce<IAccounts>((result, [name, sum], index) => {
        const amount = parseFloat(sum.replace(/[^\d,]/g, "").replace(",", "."));
        result[`G${index + 3}`] = [name, amount];
        return result;
      }, {});

      setAccounts(result);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataContext.Provider
      value={{ accounts, incomes, expenses, loading, error }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useSheetData() {
  const context = useContext(DataContext);
  if (context == null) {
    throw new Error("useData должен использоваться внутри DataProvider");
  }
  return context;
}
