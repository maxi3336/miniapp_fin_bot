import { useContext } from "react";
import { SheetContext } from "../SheetContext";

export function useSheetData() {
  const context = useContext(SheetContext);
  if (context == null) {
    throw new Error("useData должен использоваться внутри DataProvider");
  }
  return context;
}
