import { API_GET } from "@/lib/utils";

export const ACCOUNTS_URL = API_GET + "Главная!G3:H14";
export const OPERATIONS_URL = API_GET + "Главная!A3:E";
export const INCOME_URL = API_GET + "Доходы!A2:A9";
export const EXPENSE_URL = API_GET + "Расходы!A2:A16";

export type ISheetRes = Array<[string]>;
export type IAccountsRes = Array<[string, string]>;
export type IOperationsRes = Array<[string, string, string, string, string?]>;

export type IAccounts = Record<string, [string, number]>;
export type IOperation = {
  date: Date;
  category: string;
  amount: number;
  account: string;
  comment?: string;
};
export type IOperations = Array<IOperation>;

export interface SheetContextType {
  accounts: IAccounts;
  operations: IOperations;
  incomes: string[];
  expenses: string[];
  loading: boolean;
  error: Error | null;
  onLoading: (value: boolean) => void;
  onFetch: () => Promise<void>;
}
