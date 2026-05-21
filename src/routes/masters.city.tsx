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

export const Route = createFileRoute("/masters/city")({
  head: () => ({
    meta: [
      { title: "City / District Master — MediCore HMS" },
      { name: "description", content: "Manage cities and districts with cascading country and state filtering." },
    ],
  }),
  component: CityMaster,
});

const DATA: Record<string, string[]> = {
  India: ["Maharashtra", "Karnataka", "Delhi", "Tamil Nadu", "Gujarat"],
  "United States": ["California", "Texas", "New York"],
  "United Kingdom": ["England", "Scotland"],
  UAE: ["Dubai", "Abu Dhabi"],
};

interface Row { id: string; name: string; country: string; state: string; active: boolean; }

const initial: Row[] = [
  { id: "c1", name: "Mumbai", country: "India", state: "Maharashtra", active: true },
  { id: "c2", name: "Pune", country: "India", state: "Maharashtra", active: true },
  { id: "c3", name: "Bengaluru", country: "India", state: "Karnataka", active: true },
  { id: "c4", name: "Chennai", country: "India", state: "Tamil Nadu", active: true },
  { id: "c5", name: "New Delhi", country: "India", state: "Delhi", active: true },
  { id: "c6", name: "San Francisco", country: "United States", state: "California", active: true },
  { id: "c7", name: "Austin", country: "United States", state: "Texas", active: false },
];

function CityMaster() {
  const [rows, setRows] = useState(initial);
  const [q, setQ] = useState("");
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterState, setFilterState] = useState("all");

  const [name, setName] = useState("");
  const [country, setCountry] = useState("India");
  const [state, setState] = useState(DATA["India"][0]);

  const states = DATA[country] ?? [];
  const filterStates = filterCountry === "all" ? [] : DATA[filterCountry] ?? [];

  const filtered = useMemo(() => rows.filter((r) =>
    (filterCountry === "all" || r.country === filterCountry) &&
    (filterState === "all" || r.state === filterState) &&
    r.name.toLowerCase().includes(q.toLowerCase()),
  ), [rows, q, filterCountry, filterState]);

  const add = () => {
    if (!name.trim()) return toast.error("City name is required.");
    setRows((p) => [{ id: `c${Date.now()}`, name: name.trim(), country, state, active: true }, ...p]);
    setName("");
    toast.success("City added.");
  };

  return (
    <DashboardLayout title="City / District Master" subtitle="Cities grouped by country and state with cascading filters.">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="space-y-3 p-5">
            <p className="text-sm font-medium">Add city / district</p>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Country</Label>
              <Select
                value={country}
                onValueChange={(v) => { setCountry(v); setState(DATA[v][0]); }}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.keys(DATA).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">State</Label>
              <Select value={state} onValueChange={setState}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {states.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">City / District</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Nagpur" />
            </div>
            <Button className="w-full" onClick={add}><Plus className="h-4 w-4" /> Add City</Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="p-0">
            <div className="flex flex-col gap-2 border-b p-3 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search city…" className="h-9 pl-8" />
              </div>
              <Select
                value={filterCountry}
                onValueChange={(v) => { setFilterCountry(v); setFilterState("all"); }}
              >
                <SelectTrigger className="h-9 md:w-44"><SelectValue placeholder="Country" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All countries</SelectItem>
                  {Object.keys(DATA).map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={filterState} onValueChange={setFilterState} disabled={filterCountry === "all"}>
                <SelectTrigger className="h-9 md:w-44"><SelectValue placeholder="State" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All states</SelectItem>
                  {filterStates.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
              <Badge variant="secondary" className="self-center">{filtered.length}</Badge>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium">City</th>
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
                    <td className="px-4 py-2.5 text-muted-foreground">{r.state}</td>
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
