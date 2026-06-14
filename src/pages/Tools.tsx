import { useMemo, useState } from "react";
import { User } from "@supabase/supabase-js";
import { z } from "zod";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, PiggyBank, Landmark, PieChart as PieIcon } from "lucide-react";

interface ToolsProps {
  user: User;
}

const formatLei = (n: number) =>
  new Intl.NumberFormat("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
    isFinite(n) ? n : 0
  ) + " lei";

const positiveNumber = z.coerce.number({ invalid_type_error: "Introdu un număr" }).positive("Trebuie să fie pozitiv");
const nonNegativeNumber = z.coerce.number({ invalid_type_error: "Introdu un număr" }).min(0, "Nu poate fi negativ");
const rateSchema = z.coerce.number({ invalid_type_error: "Introdu un număr" }).min(0, "Minim 0").max(100, "Maxim 100");
const positiveInt = z.coerce.number({ invalid_type_error: "Introdu un număr" }).int("Trebuie să fie întreg").positive("Trebuie să fie pozitiv");

// ---------- Field helper ----------
interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  suffix?: string;
  type?: string;
}
const Field = ({ label, value, onChange, placeholder, error, suffix, type = "number" }: FieldProps) => (
  <div className="space-y-1.5">
    <Label className="text-sm font-medium">{label}</Label>
    <div className="relative">
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={error ? "border-destructive pr-12" : "pr-12"}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          {suffix}
        </span>
      )}
    </div>
    {error && <p className="text-xs text-destructive">{error}</p>}
  </div>
);

// ---------- 1. Compound Interest ----------
const CompoundInterest = () => {
  const [pv, setPv] = useState("10000");
  const [pmt, setPmt] = useState("500");
  const [r, setR] = useState("7");
  const [t, setT] = useState("10");

  const pvP = positiveNumber.safeParse(pv);
  const pmtP = nonNegativeNumber.safeParse(pmt);
  const rP = rateSchema.safeParse(r);
  const tP = positiveInt.safeParse(t);

  const valid = pvP.success && pmtP.success && rP.success && tP.success;

  const data = useMemo(() => {
    if (!valid) return [];
    const PV = pvP.data!;
    const PMT = pmtP.data!;
    const rate = rP.data! / 100;
    const years = tP.data!;
    const n = 12;
    const rows: { year: number; total: number; principal: number }[] = [];
    for (let y = 0; y <= years; y++) {
      const nt = n * y;
      const factor = Math.pow(1 + rate / n, nt);
      const fv = PV * factor + (rate > 0 ? PMT * ((factor - 1) / (rate / n)) : PMT * nt);
      const principal = PV + PMT * nt;
      rows.push({ year: y, total: Math.round(fv * 100) / 100, principal: Math.round(principal * 100) / 100 });
    }
    return rows;
  }, [valid, pvP, pmtP, rP, tP]);

  const finalValue = data.length ? data[data.length - 1].total : 0;
  const totalPrincipal = data.length ? data[data.length - 1].principal : 0;
  const interest = finalValue - totalPrincipal;

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Date de intrare</CardTitle>
          <CardDescription>Calculează puterea dobânzii compuse pe termen lung</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Sumă inițială" value={pv} onChange={setPv} suffix="lei" error={!pvP.success ? pvP.error.issues[0].message : undefined} />
          <Field label="Contribuție lunară" value={pmt} onChange={setPmt} suffix="lei" error={!pmtP.success ? pmtP.error.issues[0].message : undefined} />
          <Field label="Rată anuală" value={r} onChange={setR} suffix="%" error={!rP.success ? rP.error.issues[0].message : undefined} />
          <Field label="Număr de ani" value={t} onChange={setT} suffix="ani" error={!tP.success ? tP.error.issues[0].message : undefined} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Rezultate</CardTitle>
          <CardDescription>Evoluția investiției tale</CardDescription>
        </CardHeader>
        <CardContent>
          {valid ? (
            <>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-gradient-to-br from-[hsl(var(--minty-green))]/10 to-[hsl(var(--aqua))]/10">
                  <p className="text-xs text-muted-foreground mb-1">Valoare finală</p>
                  <p className="text-xl font-bold">{formatLei(finalValue)}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground mb-1">Dobândă acumulată</p>
                  <p className="text-xl font-bold text-[hsl(var(--aqua))]">{formatLei(interest)}</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" label={{ value: "Ani", position: "insideBottom", offset: -5 }} />
                  <YAxis />
                  <Tooltip formatter={(v: number) => formatLei(v)} />
                  <Legend />
                  <Line type="monotone" dataKey="total" name="Valoare totală" stroke="hsl(var(--aqua))" strokeWidth={2} />
                  <Line type="monotone" dataKey="principal" name="Capital depus" stroke="hsl(var(--minty-green))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Completează toate câmpurile pentru a vedea rezultatele.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ---------- 2. Emergency Fund ----------
const EmergencyFund = () => {
  const [income, setIncome] = useState("5000");
  const [expenses, setExpenses] = useState("3500");
  const [months, setMonths] = useState("6");
  const [savings, setSavings] = useState("2000");

  const iP = positiveNumber.safeParse(income);
  const eP = positiveNumber.safeParse(expenses);
  const mP = positiveInt.safeParse(months);
  const sP = nonNegativeNumber.safeParse(savings);
  const valid = iP.success && eP.success && mP.success && sP.success;

  const target = valid ? eP.data! * mP.data! : 0;
  const deficit = Math.max(target - (sP.data ?? 0), 0);
  const monthlySaving = valid ? Math.max(iP.data! - eP.data!, 0) : 0;
  const monthsToTarget = monthlySaving > 0 ? Math.ceil(deficit / monthlySaving) : Infinity;

  const data = valid ? [
    { name: "Economii curente", value: Math.round((sP.data ?? 0) * 100) / 100 },
    { name: "Țintă", value: Math.round(target * 100) / 100 },
  ] : [];

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Date de intrare</CardTitle>
          <CardDescription>Construiește-ți plasa de siguranță financiară</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Venit lunar net" value={income} onChange={setIncome} suffix="lei" error={!iP.success ? iP.error.issues[0].message : undefined} />
          <Field label="Cheltuieli lunare totale" value={expenses} onChange={setExpenses} suffix="lei" error={!eP.success ? eP.error.issues[0].message : undefined} />
          <Field label="Luni dorite de rezervă" value={months} onChange={setMonths} suffix="luni" error={!mP.success ? mP.error.issues[0].message : undefined} />
          <Field label="Economii actuale" value={savings} onChange={setSavings} suffix="lei" error={!sP.success ? sP.error.issues[0].message : undefined} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Rezultate</CardTitle>
          <CardDescription>Cât îți mai trebuie până la siguranță</CardDescription>
        </CardHeader>
        <CardContent>
          {valid ? (
            <>
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="p-3 rounded-lg bg-gradient-to-br from-[hsl(var(--minty-green))]/10 to-[hsl(var(--aqua))]/10">
                  <p className="text-xs text-muted-foreground mb-1">Țintă</p>
                  <p className="text-sm font-bold">{formatLei(target)}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground mb-1">Deficit</p>
                  <p className="text-sm font-bold text-destructive">{formatLei(deficit)}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground mb-1">Luni până la țintă</p>
                  <p className="text-sm font-bold">{monthsToTarget === Infinity ? "—" : monthsToTarget}</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(v: number) => formatLei(v)} />
                  <Bar dataKey="value" fill="hsl(var(--aqua))" />
                </BarChart>
              </ResponsiveContainer>
              {monthlySaving === 0 && (
                <p className="text-xs text-destructive mt-3">Cheltuielile depășesc sau egalează veniturile — nu poți economisi în acest ritm.</p>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Completează toate câmpurile pentru a vedea rezultatele.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ---------- 3. Loan Amortization ----------
const LoanAmortization = () => {
  const [amount, setAmount] = useState("100000");
  const [rate, setRate] = useState("6.5");
  const [years, setYears] = useState("20");

  const aP = positiveNumber.safeParse(amount);
  const rP = rateSchema.safeParse(rate);
  const yP = positiveInt.safeParse(years);
  const valid = aP.success && rP.success && yP.success;

  const { monthly, totalPaid, totalInterest, data } = useMemo(() => {
    if (!valid) return { monthly: 0, totalPaid: 0, totalInterest: 0, data: [] as any[] };
    const P = aP.data!;
    const r = rP.data! / 100 / 12;
    const n = yP.data! * 12;
    const m = r > 0 ? (P * (r * Math.pow(1 + r, n))) / (Math.pow(1 + r, n) - 1) : P / n;
    let balance = P;
    let cumulativeInterest = 0;
    const rows: { month: number; principal: number; interest: number }[] = [];
    const step = Math.max(1, Math.floor(n / 60));
    for (let i = 1; i <= n; i++) {
      const interestPay = balance * r;
      const principalPay = m - interestPay;
      balance -= principalPay;
      cumulativeInterest += interestPay;
      if (i % step === 0 || i === n) {
        rows.push({
          month: i,
          principal: Math.max(Math.round(balance * 100) / 100, 0),
          interest: Math.round(cumulativeInterest * 100) / 100,
        });
      }
    }
    return { monthly: m, totalPaid: m * n, totalInterest: m * n - P, data: rows };
  }, [valid, aP, rP, yP]);

  const principalRatio = totalPaid > 0 ? ((aP.data ?? 0) / totalPaid) * 100 : 0;

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Date de intrare</CardTitle>
          <CardDescription>Vezi cât plătești în realitate pentru un credit</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Suma creditului" value={amount} onChange={setAmount} suffix="lei" error={!aP.success ? aP.error.issues[0].message : undefined} />
          <Field label="Rată anuală a dobânzii" value={rate} onChange={setRate} suffix="%" error={!rP.success ? rP.error.issues[0].message : undefined} />
          <Field label="Durata" value={years} onChange={setYears} suffix="ani" error={!yP.success ? yP.error.issues[0].message : undefined} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Rezultate</CardTitle>
          <CardDescription>Rata lunară și costul total al creditului</CardDescription>
        </CardHeader>
        <CardContent>
          {valid ? (
            <>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 rounded-lg bg-gradient-to-br from-[hsl(var(--minty-green))]/10 to-[hsl(var(--aqua))]/10">
                  <p className="text-xs text-muted-foreground mb-1">Rata lunară</p>
                  <p className="text-lg font-bold">{formatLei(monthly)}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground mb-1">Total plătit</p>
                  <p className="text-lg font-bold">{formatLei(totalPaid)}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground mb-1">Total dobândă</p>
                  <p className="text-lg font-bold text-destructive">{formatLei(totalInterest)}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted">
                  <p className="text-xs text-muted-foreground mb-1">Principal / Total</p>
                  <p className="text-lg font-bold">{principalRatio.toFixed(1)}%</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" label={{ value: "Luna", position: "insideBottom", offset: -5 }} />
                  <YAxis />
                  <Tooltip formatter={(v: number) => formatLei(v)} />
                  <Legend />
                  <Area type="monotone" dataKey="principal" name="Sold rămas" stroke="hsl(var(--minty-green))" fill="hsl(var(--minty-green))" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="interest" name="Dobândă cumulată" stroke="hsl(var(--aqua))" fill="hsl(var(--aqua))" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Completează toate câmpurile pentru a vedea rezultatele.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ---------- 4. 50/30/20 Rule ----------
const Rule503020 = () => {
  const [income, setIncome] = useState("5000");
  const iP = positiveNumber.safeParse(income);
  const valid = iP.success;

  const needs = valid ? iP.data! * 0.5 : 0;
  const wants = valid ? iP.data! * 0.3 : 0;
  const savings = valid ? iP.data! * 0.2 : 0;

  const data = [
    { name: "Nevoi (50%)", value: Math.round(needs * 100) / 100, color: "hsl(var(--minty-green))" },
    { name: "Dorințe (30%)", value: Math.round(wants * 100) / 100, color: "hsl(var(--aqua))" },
    { name: "Economii (20%)", value: Math.round(savings * 100) / 100, color: "hsl(var(--primary))" },
  ];

  const categories = [
    { title: "50% Nevoi", amount: needs, desc: "Chirie, utilități, mâncare, transport, asigurări", color: "hsl(var(--minty-green))" },
    { title: "30% Dorințe", amount: wants, desc: "Divertisment, restaurante, hobby-uri, vacanțe", color: "hsl(var(--aqua))" },
    { title: "20% Economii", amount: savings, desc: "Investiții, fond de urgență, rambursare datorii", color: "hsl(var(--primary))" },
  ];

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Date de intrare</CardTitle>
          <CardDescription>Împarte-ți venitul după regula clasică 50/30/20</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Field label="Venit lunar net" value={income} onChange={setIncome} suffix="lei" error={!iP.success ? iP.error.issues[0].message : undefined} />
          {valid && (
            <div className="space-y-3 pt-2">
              {categories.map((c) => (
                <div key={c.title} className="p-3 rounded-lg border" style={{ borderLeftWidth: 4, borderLeftColor: c.color }}>
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-semibold text-sm">{c.title}</p>
                    <p className="font-bold text-sm">{formatLei(c.amount)}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{c.desc}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Distribuție bugetară</CardTitle>
          <CardDescription>Reprezentare vizuală a alocării</CardDescription>
        </CardHeader>
        <CardContent>
          {valid ? (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={110} label={(e: any) => `${e.name}`}>
                  {data.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => formatLei(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground">Introdu venitul pentru a vedea distribuția.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

// ---------- Page ----------
const Tools = ({ user }: ToolsProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 lg:py-12">
        <header className="mb-8 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-bold mb-3 bg-gradient-to-r from-[hsl(var(--minty-green))] to-[hsl(var(--aqua))] bg-clip-text text-transparent">
            Calculatoare financiare
          </h1>
          <p className="text-muted-foreground">
            Unelte interactive pentru a-ți planifica și înțelege mai bine deciziile financiare.
          </p>
        </header>

        <Tabs defaultValue="compound" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto mb-6">
            <TabsTrigger value="compound" className="py-3 gap-2">
              <Calculator className="w-4 h-4" /> <span className="hidden sm:inline">Dobândă</span> compusă
            </TabsTrigger>
            <TabsTrigger value="emergency" className="py-3 gap-2">
              <PiggyBank className="w-4 h-4" /> Fond urgență
            </TabsTrigger>
            <TabsTrigger value="loan" className="py-3 gap-2">
              <Landmark className="w-4 h-4" /> Credit
            </TabsTrigger>
            <TabsTrigger value="rule" className="py-3 gap-2">
              <PieIcon className="w-4 h-4" /> 50/30/20
            </TabsTrigger>
          </TabsList>
          <TabsContent value="compound"><CompoundInterest /></TabsContent>
          <TabsContent value="emergency"><EmergencyFund /></TabsContent>
          <TabsContent value="loan"><LoanAmortization /></TabsContent>
          <TabsContent value="rule"><Rule503020 /></TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default Tools;
