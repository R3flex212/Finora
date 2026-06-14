import { useEffect, useMemo, useState } from "react";
import { User } from "@supabase/supabase-js";
import { z } from "zod";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ChevronLeft, ChevronRight, Trash2, Wallet } from "lucide-react";
import { toast } from "sonner";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BudgetProps {
  user: User;
}

interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  description: string | null;
  expense_date: string;
  created_at: string;
}

const CATEGORIES = [
  "Mâncare",
  "Transport",
  "Utilități",
  "Chirie",
  "Sănătate",
  "Divertisment",
  "Îmbrăcăminte",
  "Educație",
  "Economii",
  "Altele",
];

const CATEGORY_COLORS: Record<string, string> = {
  "Mâncare": "#4CAF50",
  "Transport": "#2196F3",
  "Utilități": "#FF9800",
  "Chirie": "#E91E63",
  "Sănătate": "#9C27B0",
  "Divertisment": "#00BCD4",
  "Îmbrăcăminte": "#FF5722",
  "Educație": "#607D8B",
  "Economii": "#8BC34A",
  "Altele": "#FFC107",
};

const MONTH_NAMES = [
  "Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie",
  "Iulie", "August", "Septembrie", "Octombrie", "Noiembrie", "Decembrie",
];

const formatLei = (n: number) =>
  new Intl.NumberFormat("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + " lei";

const todayStr = () => new Date().toISOString().slice(0, 10);

const expenseSchema = z.object({
  amount: z.coerce.number({ invalid_type_error: "Introdu un număr valid" }).positive("Suma trebuie să fie pozitivă"),
  category: z.string().min(1, "Selectează o categorie"),
  expense_date: z.string().min(1, "Selectează o dată").refine((v) => !isNaN(new Date(v).getTime()), "Dată invalidă"),
  description: z.string().max(500, "Maxim 500 caractere").optional(),
});

const Budget = ({ user }: BudgetProps) => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [expenseDate, setExpenseDate] = useState(todayStr());
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const monthRange = useMemo(() => {
    const start = new Date(selectedMonth.year, selectedMonth.month, 1);
    const end = new Date(selectedMonth.year, selectedMonth.month + 1, 1);
    const toIso = (d: Date) => d.toISOString().slice(0, 10);
    return { start: toIso(start), end: toIso(end) };
  }, [selectedMonth]);

  const fetchExpenses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("expenses")
      .select("*")
      .gte("expense_date", monthRange.start)
      .lt("expense_date", monthRange.end)
      .order("expense_date", { ascending: false });

    if (error) {
      toast.error("Eroare la încărcarea cheltuielilor");
      setExpenses([]);
    } else {
      setExpenses((data ?? []) as Expense[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchExpenses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthRange.start]);

  const handleSubmit = async () => {
    const parsed = expenseSchema.safeParse({
      amount,
      category,
      expense_date: expenseDate,
      description: description || undefined,
    });

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      parsed.error.errors.forEach((err) => {
        if (err.path[0]) fieldErrors[String(err.path[0])] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    const { error } = await supabase.from("expenses").insert({
      user_id: user.id,
      amount: parsed.data.amount,
      category: parsed.data.category,
      expense_date: parsed.data.expense_date,
      description: parsed.data.description ?? null,
    });

    setSubmitting(false);

    if (error) {
      toast.error("Eroare la salvare: " + error.message);
      return;
    }

    toast.success("Cheltuială adăugată");
    setAmount("");
    setCategory("");
    setDescription("");
    setExpenseDate(todayStr());
    fetchExpenses();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("expenses").delete().eq("id", id);
    if (error) {
      toast.error("Eroare la ștergere");
      return;
    }
    toast.success("Cheltuială ștearsă");
    fetchExpenses();
  };

  const totals = useMemo(() => {
    const total = expenses.reduce((s, e) => s + Number(e.amount), 0);
    const byCat: Record<string, number> = {};
    expenses.forEach((e) => {
      byCat[e.category] = (byCat[e.category] ?? 0) + Number(e.amount);
    });
    const topCategory =
      Object.entries(byCat).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
    const pieData = Object.entries(byCat).map(([name, value]) => ({ name, value }));
    return { total, count: expenses.length, topCategory, pieData };
  }, [expenses]);

  const prevMonth = () =>
    setSelectedMonth((m) => {
      const d = new Date(m.year, m.month - 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  const nextMonth = () =>
    setSelectedMonth((m) => {
      const d = new Date(m.year, m.month + 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-[hsl(var(--minty-green))] to-[hsl(var(--aqua))]">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Buget personal</h1>
            <p className="text-muted-foreground text-sm">
              Adaugă și urmărește cheltuielile tale lunare
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[400px_1fr] gap-6">
          {/* LEFT — Form */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Adaugă cheltuială</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Sumă</Label>
                <div className="relative">
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className={errors.amount ? "border-destructive pr-12" : "pr-12"}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    lei
                  </span>
                </div>
                {errors.amount && <p className="text-xs text-destructive">{errors.amount}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Categorie</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                    <SelectValue placeholder="Selectează categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-xs text-destructive">{errors.category}</p>}
              </div>

              <div className="space-y-1.5">
                <Label>Dată</Label>
                <Input
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className={errors.expense_date ? "border-destructive" : ""}
                />
                {errors.expense_date && (
                  <p className="text-xs text-destructive">{errors.expense_date}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label>Descriere (opțional)</Label>
                <Input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Cumpărături supermarket"
                  className={errors.description ? "border-destructive" : ""}
                />
                {errors.description && (
                  <p className="text-xs text-destructive">{errors.description}</p>
                )}
              </div>

              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full bg-gradient-to-r from-[hsl(var(--minty-green))] to-[hsl(var(--aqua))] text-white hover:opacity-90"
              >
                {submitting ? "Se salvează..." : "Adaugă cheltuială"}
              </Button>
            </CardContent>
          </Card>

          {/* RIGHT — Overview */}
          <div className="space-y-6">
            {/* Month selector */}
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm" onClick={prevMonth}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <h2 className="text-lg font-semibold">
                {MONTH_NAMES[selectedMonth.month]} {selectedMonth.year}
              </h2>
              <Button variant="outline" size="sm" onClick={nextMonth}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground font-normal">
                    Total cheltuieli
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{formatLei(totals.total)}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground font-normal">
                    Tranzacții
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{totals.count}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground font-normal">
                    Categoria principală
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold truncate">{totals.topCategory}</p>
                </CardContent>
              </Card>
            </div>

            {/* Pie chart */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuție pe categorii</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-[300px] w-full" />
                ) : totals.pieData.length === 0 ? (
                  <p className="text-center text-muted-foreground py-12">
                    Nu există date pentru această lună
                  </p>
                ) : (
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={totals.pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={(entry: any) =>
                            `${entry.name} ${((entry.percent ?? 0) * 100).toFixed(0)}%`
                          }
                        >
                          {totals.pieData.map((entry) => (
                            <Cell
                              key={entry.name}
                              fill={CATEGORY_COLORS[entry.name] ?? "#999"}
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v: number) => formatLei(Number(v))} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Expenses table */}
            <Card>
              <CardHeader>
                <CardTitle>Lista cheltuieli</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : expenses.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    Nu ai cheltuieli înregistrate pentru această lună. Adaugă prima ta cheltuială!
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Dată</TableHead>
                          <TableHead>Categorie</TableHead>
                          <TableHead>Descriere</TableHead>
                          <TableHead className="text-right">Sumă</TableHead>
                          <TableHead className="w-12"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {expenses.map((e) => (
                          <TableRow key={e.id}>
                            <TableCell>
                              {new Date(e.expense_date).toLocaleDateString("ro-RO")}
                            </TableCell>
                            <TableCell>
                              <Badge
                                style={{
                                  backgroundColor: CATEGORY_COLORS[e.category] ?? "#999",
                                  color: "white",
                                }}
                              >
                                {e.category}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {e.description ?? "—"}
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatLei(Number(e.amount))}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDelete(e.id)}
                                className="h-8 w-8 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Budget;
