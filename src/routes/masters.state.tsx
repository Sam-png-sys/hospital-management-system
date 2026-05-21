import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Pencil, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/masters/state")({
  head: () => ({
    meta: [
      { title: "State Master — MediCore HMS" },
      { name: "description", content: "Manage states grouped by country with active status." },
    ],
  }),
  component: StateMaster,
});

const COUNTRIES = ["India", "United States", "United Kingdom", "UAE"];

interface Row { id: string; name: string; country: string; active: boolean; }

const initial: Row[] = [
  { id: "s1", name: "Maharashtra", country: "India", active: true },
  { id: "s2", name: "Karnataka", country: "India", active: true },
  { id: "s3", name: "Delhi", country: "India", active: true },
  { id: "s4", name: "Tamil Nadu", country: "India", active: true },
  { id: "s5", name: "California", country: "United States", active: true },
  { id: "s6", name: "Texas", country: "United States", active: false },
  { id: "s7", name: "Dubai", country: "UAE", active: true },
];

function StateMaster() {
  const [rows, setRows] = useState(initial);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("India");

  const filtered = useMemo(() => {
    return rows.filter(
      (r) =>
        (filter === "all" || r.country === filter) &&
        r.name.toLowerCase().includes(q.toLowerCase()),
    );
  }, [rows, q, filter]);

  const add = () => {
    if (!name.trim()) return toast.error("State name is required.");
    setRows((p) => [{ id: `s${Date.now()}`, name: name.trim(), country, active: true }, ...p]);
    setName("");
    toast.success("State added.");
  };

  return (
    <DashboardLayout title="State Master" subtitle="States and provinces grouped by country.">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="space-y-3 p-5">
            <p className="text-sm font-medium">Add new state</p>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">State name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Gujarat" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Country</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={add}><Plus className="h-4 w-4" /> Add State</Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="p-0">
            <div className="flex flex-col gap-2 border-b p-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search states…" className="h-9 pl-8" />
              </div>
              <Select value={filter} onValueChange={setFilter}>
                <SelectTrigger className="h-9 w-full sm:w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All countries</SelectItem>
                  {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Badge variant="secondary" className="self-center">{filtered.length}</Badge>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium">State</th>
                  <th className="px-4 py-2.5 text-left font-medium">Country</th>
                  <th className="px-4 py-2.5 text-center font-medium">Active</th>
                  <th className="px-4 py-2.5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="px-4 py-2.5 font-medium">{r.name}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{r.country}</td>
                    <td className="px-4 py-2.5 text-center">
                      <Switch
                        checked={r.active}
                        onCheckedChange={() =>
                          setRows((p) => p.map((x) => (x.id === r.id ? { ...x, active: !x.active } : x)))
                        }
                      />
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <Button size="icon" variant="ghost"><Pencil className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
