import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/masters/prefix")({
  head: () => ({
    meta: [
      { title: "Prefix Master — MediCore HMS" },
      { name: "description", content: "Manage salutation prefixes and gender mapping." },
    ],
  }),
  component: PrefixMaster,
});

interface PrefixRow { id: string; name: string; gender: string; active: boolean; }

const initial: PrefixRow[] = [
  { id: "p1", name: "Mr", gender: "Male", active: true },
  { id: "p2", name: "Mrs", gender: "Female", active: true },
  { id: "p3", name: "Ms", gender: "Female", active: true },
  { id: "p4", name: "Dr", gender: "Any", active: true },
  { id: "p5", name: "Master", gender: "Male", active: true },
  { id: "p6", name: "Baby", gender: "Any", active: false },
];

function PrefixMaster() {
  const [rows, setRows] = useState(initial);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("Male");

  const filtered = rows.filter((r) => r.name.toLowerCase().includes(q.toLowerCase()));

  const add = () => {
    if (!name.trim()) return toast.error("Prefix name is required.");
    setRows((p) => [{ id: `p${Date.now()}`, name: name.trim(), gender, active: true }, ...p]);
    setName("");
    toast.success("Prefix added.");
  };

  const toggle = (id: string) =>
    setRows((p) => p.map((r) => (r.id === id ? { ...r, active: !r.active } : r)));

  return (
    <DashboardLayout title="Prefix Master" subtitle="Salutations used across registration forms.">
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardContent className="space-y-3 p-5">
            <p className="text-sm font-medium">Add new prefix</p>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Prefix</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Prof" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Gender mapping</Label>
              <Select value={gender} onValueChange={setGender}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {["Male", "Female", "Any"].map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" onClick={add}><Plus className="h-4 w-4" /> Add Prefix</Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 border-b p-3">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search prefixes…" className="h-9 pl-8" />
              </div>
              <Badge variant="secondary">{filtered.length}</Badge>
            </div>
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium">Prefix</th>
                  <th className="px-4 py-2.5 text-left font-medium">Gender</th>
                  <th className="px-4 py-2.5 text-center font-medium">Status</th>
                  <th className="px-4 py-2.5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="px-4 py-2.5 font-medium">{r.name}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{r.gender}</td>
                    <td className="px-4 py-2.5 text-center">
                      <Switch checked={r.active} onCheckedChange={() => toggle(r.id)} />
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
