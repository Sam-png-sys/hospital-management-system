import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  ArrowUpRight,
  BedDouble,
  Calendar,
  IndianRupee,
  Plus,
  Stethoscope,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/dashboard-layout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — MediCore HMS" },
      { name: "description", content: "Hospital operations dashboard: OPD, IPD, revenue and doctor availability at a glance." },
    ],
  }),
  component: Dashboard,
});

const stats = [
  { label: "Total Patients", value: "12,485", delta: "+4.2%", icon: Users, tone: "text-primary" },
  { label: "Today OPD", value: "342", delta: "+18 vs avg", icon: Stethoscope, tone: "text-accent" },
  { label: "Doctors Available", value: "47 / 62", delta: "76% on shift", icon: Activity, tone: "text-success" },
  { label: "Today Revenue", value: "₹ 4.82L", delta: "+12.4%", icon: IndianRupee, tone: "text-primary" },
];

const trend = [
  { d: "Mon", opd: 280, ipd: 42 },
  { d: "Tue", opd: 310, ipd: 48 },
  { d: "Wed", opd: 295, ipd: 51 },
  { d: "Thu", opd: 340, ipd: 46 },
  { d: "Fri", opd: 372, ipd: 55 },
  { d: "Sat", opd: 410, ipd: 60 },
  { d: "Sun", opd: 220, ipd: 38 },
];

const depts = [
  { name: "Cardiology", v: 86 },
  { name: "Orthopedics", v: 74 },
  { name: "Pediatrics", v: 65 },
  { name: "Neurology", v: 52 },
  { name: "ENT", v: 41 },
  { name: "Derma", v: 33 },
];

const recent = [
  { opd: "OPD-24189", name: "Aarav Sharma", doc: "Dr. Mehta", dept: "Cardiology", amt: "₹ 800", status: "Paid" },
  { opd: "OPD-24190", name: "Priya Verma", doc: "Dr. Iyer", dept: "Pediatrics", amt: "₹ 500", status: "Pending" },
  { opd: "OPD-24191", name: "Rohan Patel", doc: "Dr. Singh", dept: "Orthopedics", amt: "₹ 700", status: "Paid" },
  { opd: "OPD-24192", name: "Sneha Rao", doc: "Dr. Khan", dept: "Derma", amt: "₹ 600", status: "Paid" },
  { opd: "OPD-24193", name: "Vikram Nair", doc: "Dr. Bose", dept: "Neurology", amt: "₹ 1,200", status: "Pending" },
];

function Dashboard() {
  return (
    <DashboardLayout
      title="Good morning, Reception"
      subtitle="Here's what's happening across the hospital today."
      actions={
        <>
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4" /> Today
          </Button>
          <Button asChild size="sm">
            <Link to="/patients/register">
              <Plus className="h-4 w-4" /> Quick Registration
            </Link>
          </Button>
        </>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {s.label}
                  </p>
                  <p className="mt-1.5 text-2xl font-semibold tracking-tight">{s.value}</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-success">
                    <TrendingUp className="h-3 w-3" /> {s.delta}
                  </p>
                </div>
                <div className={`rounded-xl bg-secondary p-2.5 ${s.tone}`}>
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-base">Patient Trends</CardTitle>
              <p className="text-xs text-muted-foreground">OPD vs IPD — last 7 days</p>
            </div>
            <Badge variant="secondary" className="font-normal">This week</Badge>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="opd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="ipd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="d" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="opd" stroke="var(--color-chart-1)" fill="url(#opd)" strokeWidth={2} />
                <Area type="monotone" dataKey="ipd" stroke="var(--color-chart-2)" fill="url(#ipd)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Department Load</CardTitle>
            <p className="text-xs text-muted-foreground">Visits today</p>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={depts}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={11} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="v" fill="var(--color-chart-2)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-base">Recent Registrations</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/patients/register">
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-hidden rounded-lg border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2 text-left font-medium">OPD No.</th>
                    <th className="px-3 py-2 text-left font-medium">Patient</th>
                    <th className="px-3 py-2 text-left font-medium">Doctor</th>
                    <th className="px-3 py-2 text-left font-medium">Dept.</th>
                    <th className="px-3 py-2 text-right font-medium">Amount</th>
                    <th className="px-3 py-2 text-right font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((r) => (
                    <tr key={r.opd} className="border-t hover:bg-muted/30">
                      <td className="px-3 py-2.5 font-mono text-xs">{r.opd}</td>
                      <td className="px-3 py-2.5 font-medium">{r.name}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{r.doc}</td>
                      <td className="px-3 py-2.5 text-muted-foreground">{r.dept}</td>
                      <td className="px-3 py-2.5 text-right">{r.amt}</td>
                      <td className="px-3 py-2.5 text-right">
                        <Badge
                          variant="secondary"
                          className={
                            r.status === "Paid"
                              ? "bg-success/15 text-success hover:bg-success/15"
                              : "bg-warning/15 text-warning-foreground hover:bg-warning/15"
                          }
                        >
                          {r.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Bed Occupancy</CardTitle>
            <p className="text-xs text-muted-foreground">IPD wards overview</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { w: "General Ward", o: 42, t: 60 },
              { w: "ICU", o: 11, t: 14 },
              { w: "Maternity", o: 18, t: 25 },
              { w: "Pediatrics", o: 14, t: 22 },
            ].map((b) => {
              const pct = Math.round((b.o / b.t) * 100);
              return (
                <div key={b.w} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="inline-flex items-center gap-2">
                      <BedDouble className="h-3.5 w-3.5 text-muted-foreground" />
                      {b.w}
                    </span>
                    <span className="text-muted-foreground">{b.o}/{b.t}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
