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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
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
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { API_APPEND, API_UPDATE, cn, formatDate } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { ru } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { useSheetData } from "@/context/SheetContext";

const formSchema = z.object({
  date: z.date({ required_error: "Дата обязательна!" }),
  category: z.string({ required_error: "Категория обязательна!" }),
  amount: z.string({ required_error: "Сумма обязательна!" }),
  account: z.string({ required_error: "Счёт обязателен!" }),
  comment: z.string({ required_error: "Комментарий обязателен!" }).optional(),
});

export function IncomeCard() {
  const { accounts, incomes, loading } = useSheetData();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit({
    date,
    account: accCell,
    category,
    amount,
    comment,
  }: z.infer<typeof formSchema>) {
    const account = accounts[accCell];
    console.log("ACCOUNT: ", account);

    const values = [formatDate(date), category, +amount, account[0]];

    if (comment) {
      values.push(comment);
    }

    try {
      await fetch(API_APPEND, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          range: "Главная!A:A",
          values: [values],
        }),
      });

      const cell = "H" + accCell.replace(/[^0-9]/g, "");
      const sum = account[1] + +amount;

      await fetch(API_UPDATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cell,
          values: [[sum]],
        }),
      });

      toast({
        title: "Ура! Доход записан!",
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
            <CardTitle>Доход</CardTitle>
            <CardDescription>
              С помощью данной формы записывается доход в таблицу.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Дата</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          disabled={loading}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: ru })
                          ) : (
                            <span>Выбери дату</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        locale={ru}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Категория</FormLabel>

                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выбери категорию" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {incomes.map((inc, idx) => (
                        <SelectItem key={idx} value={inc}>
                          {inc}
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

            <FormField
              control={form.control}
              name="account"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Счёт</FormLabel>

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
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Комментарий</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Что-то про трату"
                      className="resize-none"
                      {...field}
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
