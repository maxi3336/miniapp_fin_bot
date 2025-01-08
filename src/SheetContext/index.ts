import { createContext } from "react";
import { SheetContextType } from "./types";

export const SheetContext = createContext<SheetContextType | null>(null);

export { SheetProvider } from "./provider";
