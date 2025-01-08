import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const API = import.meta.env.VITE_API_URL;

export const API_GET = `${API}/api/sheet-data?range=`;
export const API_APPEND = `${API}/api/append-data`;
export const API_UPDATE = `${API}/api/update-data`;

export const api_data = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
};

export const SHEET_URL = import.meta.env.VITE_SHEET_URL;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

export function formatDateStr(date: string): Date {
  const [day, month, year] = date.split(".").map(Number);
  return new Date(year, month - 1, day);
}

export function formatAmount(value: string): number {
  return parseFloat(value.replace(/[^\d,]/g, "").replace(",", "."));
}
