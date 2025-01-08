import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { SHEET_URL } from "@/lib/utils";

export function DataCard() {
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
      <CardContent className="space-y-4"></CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
}
