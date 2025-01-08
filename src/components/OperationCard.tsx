import { useState } from "react";
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
import { Label } from "@/components/ui/label";
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
import { API_APPEND, api_data, API_UPDATE, cn, formatDate } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { ru } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { useSheetData } from "@/context/SheetContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";

const formSchema = z.object({
  date: z.date({ required_error: "Дата обязательна!" }),
  category: z.string({ required_error: "Категория обязательна!" }),
  amount: z.string({ required_error: "Сумма обязательна!" }),
  account: z.string({ required_error: "Счёт обязателен!" }),
  comment: z.string({ required_error: "Комментарий обязателен!" }).optional(),
});

type IOperation = "expense" | "income";

export function OperationCard() {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [operation, setOperation] = useState<IOperation>("expense");

  const { accounts, incomes, expenses, loading, onLoading, onFetch } =
    useSheetData();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: undefined,
      category: undefined,
      amount: undefined,
      account: undefined,
      comment: undefined,
    },
  });

  async function handleSumbit(data: z.infer<typeof formSchema>) {
    onLoading(true);

    const { category, comment } = data;

    const account = accounts[data.account];
    const date = formatDate(data.date);
    const amount = +data.amount;

    const values = [date, category, amount, account[0]];

    if (comment) {
      values.push(comment);
    }

    try {
      const cell = "H" + data.account.replace(/[^0-9]/g, "");
      let sum = 0;

      if (operation === "income") {
        sum = account[1] + amount;
      } else {
        sum = account[1] - amount;
      }

      await Promise.all([
        fetch(API_APPEND, {
          ...api_data,
          body: JSON.stringify({
            range: "Главная!A:A",
            values: [values],
          }),
        }),
        fetch(API_UPDATE, {
          ...api_data,
          body: JSON.stringify({
            cell,
            values: [[sum]],
          }),
        }),
      ]);

      await onFetch();

      form.reset();

      toast({
        title: "Ура! Операция записана!",
        description: `${date} - ${category}, ${amount} ₽, на ${account[0]}`,
        duration: 6000,
      });
    } catch (e) {
      console.log(e);
      toast({
        title: "ОШИБКА! ДАННЫЕ НЕ ЗАПИСАЛИСЬ!",
        description: `${e}`,
      });
    } finally {
      onLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSumbit)}>
        <Card>
          <CardHeader>
            <CardTitle>Операция</CardTitle>
            <CardDescription>
              С помощью данной формы записывается доход или расход в таблицу.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Дата</FormLabel>
                  <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
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
                        onSelect={(value) => {
                          field.onChange(value);
                          setPopoverOpen(false);
                        }}
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

            <div className="w-full flex flex-col gap-3">
              <Label htmlFor="operation">Операция</Label>
              <Tabs
                id="operation"
                value={operation}
                className="w-full"
                onValueChange={(e) => setOperation(e as IOperation)}
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="expense">Расход</TabsTrigger>
                  <TabsTrigger value="income">Доход</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Категория</FormLabel>

                  <Select
                    disabled={loading}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выбери категорию" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {(operation === "income" ? incomes : expenses).map(
                        (inc, idx) => (
                          <SelectItem key={idx} value={inc}>
                            {inc}
                          </SelectItem>
                        )
                      )}
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
                    value={field.value}
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
            {loading ? (
              <div className="flex items-center gap-2">
                <Spinner />
                Загрузка...
              </div>
            ) : (
              "Провести операцию"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
