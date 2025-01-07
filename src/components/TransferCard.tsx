import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/hooks/use-toast";
import { useSheetData } from "@/context/SheetContext";

const formSchema = z.object({
  accountFrom: z.string({ required_error: "Счёт обязателен!" }),
  accountTo: z.string({ required_error: "Счёт обязателен!" }),
  amount: z.string({ required_error: "Сумма обязательна!" }),
});

export function TransferCard() {
  const { accounts, loading } = useSheetData();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit({
    accountFrom: from,
    accountTo: to,
    amount,
  }: z.infer<typeof formSchema>) {
    const accountFrom = accounts[from];
    const accountTo = accounts[to];

    const cellFrom = "H" + from.replace(/[^0-9]/g, "");
    const cellTo = "H" + to.replace(/[^0-9]/g, "");

    const amountFrom = accountFrom[1] - +amount;
    const amountTo = accountTo[1] + +amount;

    try {
      await fetch("http://45.143.92.70:5001/api/update-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cell: cellFrom,
          values: [[amountFrom]],
        }),
      });

      await fetch("http://45.143.92.70:5001/api/update-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cell: cellTo,
          values: [[amountTo]],
        }),
      });

      toast({
        title: "Ура! Перевод записан!",
        duration: 2000,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "ОШИБКА! ДАННЫЕ НЕ ЗАПИСАЛИСЬ!",
        duration: 2000,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Перевод</CardTitle>
            <CardDescription>
              С помощью данной формы можно сделать перевод денег в таблице.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="accountFrom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Откуда</FormLabel>

                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выбери счёт" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(accounts).map(([cell, data]) => (
                        <SelectItem key={cell} value={cell}>
                          {data[0]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="accountTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Куда</FormLabel>

                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выбери счёт" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(accounts).map(([cell, data]) => (
                        <SelectItem key={cell} value={cell}>
                          {data[0]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field: { onChange, ...rest } }) => (
                <FormItem>
                  <FormLabel>Сумма</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      onChange={({ target: { value } }) =>
                        onChange(value.replace(/,/g, "."))
                      }
                      {...rest}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <div className="absolute bottom-0 left-0 px-4 pb-8 w-full bg-white">
          <Button disabled={loading} className="w-full h-14" size="lg">
            Записать расход
          </Button>
        </div>
      </form>
    </Form>
  );
}
