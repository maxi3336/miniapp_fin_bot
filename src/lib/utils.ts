import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const API = "https://miniapp-fin-bot-server.onrender.com";

export const API_GET = `${API}/api/sheet-data?range=`;
export const API_APPEND = `${API}/api/append-data`;
export const API_UPDATE = `${API}/api/update-data`;

export const api_data = {
  method: "POST",
  headers: { "Content-Type": "application/json" },
};

export const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/15uGbuW--Y0Nw8EczDIkmogrtll5NrlY_lM1MqhoW_Sc/edit?gid=0#gid=0";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Месяцы начинаются с 0
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

export function formatDateStr(date: string): Date {
  const [day, month, year] = date.split(".").map(Number); // Разделяем строку и преобразуем в числа
  return new Date(year, month - 1, day);
}

export function formatAmount(value: string): number {
  return parseFloat(value.replace(/[^\d,]/g, "").replace(",", "."));
}
