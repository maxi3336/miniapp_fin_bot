import { useState, useEffect } from "react";
import { formatAmount, formatDateStr } from "@/lib/utils";
import {
  ACCOUNTS_URL,
  EXPENSE_URL,
  IAccounts,
  IAccountsRes,
  INCOME_URL,
  IOperations,
  IOperationsRes,
  ISheetRes,
  OPERATIONS_URL,
} from "./types";
import { SheetContext } from "./index";

export function SheetProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<IAccounts>({});
  const [incomes, setIncomes] = useState<string[]>([]);
  const [expenses, setExpenses] = useState<string[]>([]);
  const [operations, setOperations] = useState<IOperations>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const urls = [ACCOUNTS_URL, OPERATIONS_URL, INCOME_URL, EXPENSE_URL];

        const responses = await Promise.all(urls.map((url) => fetch(url)));
        const [acc, op, inc, exp] = (await Promise.all(
          responses.map((response) => response.json())
        )) as [IAccountsRes, IOperationsRes, ISheetRes, ISheetRes];

        const accParsed = parseAccounts(acc);
        const opParsed = parseOperations(op);
        const incParsed = inc.map((x: string[]) => x[0]);
        const expParsed = exp.map((x: string[]) => x[0]);

        setAccounts(accParsed);
        setOperations(opParsed);
        setIncomes(incParsed);
        setExpenses(expParsed);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function parseAccounts(data: IAccountsRes): IAccounts {
    return data.reduce<IAccounts>((result, [name, sum], index) => {
      const amount = formatAmount(sum);
      result[`G${index + 3}`] = [name, amount];
      return result;
    }, {});
  }

  function parseOperations(data: IOperationsRes): IOperations {
    return data.reduce<IOperations>(
      (acc, [date, category, amount, account, comment]) => {
        acc.push({
          date: formatDateStr(date),
          category,
          amount: formatAmount(amount),
          account,
          comment,
        });
        return acc;
      },
      []
    );
  }

  async function fetchAccounts() {
    const response = await fetch(ACCOUNTS_URL);
    const data: IAccountsRes = await response.json();
    const result = parseAccounts(data);
    setAccounts(result);
  }

  return (
    <SheetContext.Provider
      value={{
        accounts,
        operations,
        incomes,
        expenses,
        loading,
        error,
        onLoading: setLoading,
        onFetch: fetchAccounts,
      }}
    >
      {children}
      export{" "}
    </SheetContext.Provider>
  );
}
