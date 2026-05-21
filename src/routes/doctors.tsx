import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Pencil, Plus, Search, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/doctors")({
  head: () => ({
    meta: [
      { title: "Doctors — MediCore HMS" },
      { name: "description", content: "Manage hospital doctors, departments, charges and service mapping." },
    ],
  }),
  component: DoctorsPage,
});

interface Doctor {
  id: string;
  first: string;
  last: string;
  gender: string;
  mobile: string;
  dept: string;
  type: string;
  qual: string;
  reg: string;
  fee: number;
  followFee: number;
  active: boolean;
}

const seed: Doctor[] = [
  { id: "d1", first: "Arjun", last: "Mehta", gender: "Male", mobile: "9810011001", dept: "Cardiology", type: "Consultant", qual: "MD, DM Cardiology", reg: "MCI-22481", fee: 800, followFee: 400, active: true },
  { id: "d2", first: "Kavya", last: "Iyer", gender: "Female", mobile: "9810022002", dept: "Pediatrics", type: "Senior Consultant", qual: "MD Pediatrics", reg: "MCI-11290", fee: 500, followFee: 250, active: true },
  { id: "d3", first: "Rahul", last: "Singh", gender: "Male", mobile: "9810033003", dept: "Orthopedics", type: "Surgeon", qual: "MS Ortho", reg: "MCI-33112", fee: 700, followFee: 350, active: true },
  { id: "d4", first: "Sara", last: "Khan", gender: "Female", mobile: "9810044004", dept: "Dermatology", type: "Consultant", qual: "MD Derma", reg: "MCI-44820", fee: 600, followFee: 300, active: false },
  { id: "d5", first: "Anirban", last: "Bose", gender: "Male", mobile: "9810055005", dept: "Neurology", type: "Senior Consultant", qual: "DM Neuro", reg: "MCI-55731", fee: 1200, followFee: 600, active: true },
];

function DoctorsPage() {
  const [list, setList] = useState(seed);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Doctor | null>(null);

  const filtered = useMemo(() => {
    const t = q.toLowerCase().trim();
    if (!t) return list;
    return list.filter(
      (d) =>
        `${d.first} ${d.last}`.toLowerCase().includes(t) ||
        d.mobile.includes(t) ||
        d.dept.toLowerCase().includes(t),
    );
  }, [q, list]);

  const startNew = () => {
    setEditing({
      id: `d${Date.now()}`, first: "", last: "", gender: "Male", mobile: "",
      dept: "Cardiology", type: "Consultant", qual: "", reg: "",
      fee: 0, followFee: 0, active: true,
    });
    setOpen(true);
  };

  const save = () => {
    if (!editing) return;
    if (!editing.first || !editing.mobile) {
      toast.error("Name and mobile are required.");
      return;
    }
    setList((prev) => {
      const exists = prev.some((p) => p.id === editing.id);
      return exists ? prev.map((p) => (p.id === editing.id ? editing : p)) : [editing, ...prev];
    });
    toast.success("Doctor saved.");
    setOpen(false);
  };

  return (
    <DashboardLayout
      title="Doctor Master"
      subtitle="Manage providers, consultation charges and active status."
      actions={
        <Button size="sm" onClick={startNew}>
          <Plus className="h-4 w-4" /> Add Doctor
        </Button>
      }
    >
      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col gap-2 border-b p-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name, mobile or department…"
                className="h-9 pl-8"
              />
            </div>
            <Badge variant="secondary" className="font-normal">{filtered.length} doctors</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5 text-left font-medium">Doctor</th>
                  <th className="px-4 py-2.5 text-left font-medium">Department</th>
                  <th className="px-4 py-2.5 text-left font-medium">Qualification</th>
                  <th className="px-4 py-2.5 text-left font-medium">Mobile</th>
                  <th className="px-4 py-2.5 text-right font-medium">Consult</th>
                  <th className="px-4 py-2.5 text-right font-medium">Follow-up</th>
                  <th className="px-4 py-2.5 text-center font-medium">Status</th>
                  <th className="px-4 py-2.5"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((d) => (
                  <tr key={d.id} className="border-t hover:bg-muted/30">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-primary/10 text-xs text-primary">
                            {d.first[0]}{d.last[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium leading-tight">Dr. {d.first} {d.last}</p>
                          <p className="text-xs text-muted-foreground">{d.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center gap-1.5">
                        <Stethoscope className="h-3.5 w-3.5 text-muted-foreground" />
                        {d.dept}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-muted-foreground">{d.qual}</td>
                    <td className="px-4 py-2.5 font-mono text-xs">{d.mobile}</td>
                    <td className="px-4 py-2.5 text-right">₹ {d.fee}</td>
                    <td className="px-4 py-2.5 text-right">₹ {d.followFee}</td>
                    <td className="px-4 py-2.5 text-center">
                      <Badge
                        variant="secondary"
                        className={d.active
                          ? "bg-success/15 text-success hover:bg-success/15"
                          : "bg-muted text-muted-foreground"}
                      >
                        {d.active ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <Button
                        size="icon" variant="ghost"
                        onClick={() => { setEditing(d); setOpen(true); }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild><span /></SheetTrigger>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>{editing && list.some((l) => l.id === editing.id) ? "Edit Doctor" : "New Doctor"}</SheetTitle>
            <SheetDescription>Basic info, professional details, billing and status.</SheetDescription>
          </SheetHeader>
          {editing && (
            <div className="grid gap-3 px-4 py-2 md:grid-cols-2">
              <Field label="First name *">
                <Input value={editing.first} onChange={(e) => setEditing({ ...editing, first: e.target.value })} />
              </Field>
              <Field label="Last name">
                <Input value={editing.last} onChange={(e) => setEditing({ ...editing, last: e.target.value })} />
              </Field>
              <Field label="Gender">
                <Select value={editing.gender} onValueChange={(v) => setEditing({ ...editing, gender: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Male", "Female", "Other"].map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Mobile *">
                <Input value={editing.mobile} onChange={(e) => setEditing({ ...editing, mobile: e.target.value })} />
              </Field>
              <Field label="Department">
                <Select value={editing.dept} onValueChange={(v) => setEditing({ ...editing, dept: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Cardiology", "Pediatrics", "Orthopedics", "Dermatology", "Neurology", "ENT"].map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Doctor type">
                <Select value={editing.type} onValueChange={(v) => setEditing({ ...editing, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Consultant", "Senior Consultant", "Surgeon", "Resident", "Visiting"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Qualification" className="md:col-span-2">
                <Input value={editing.qual} onChange={(e) => setEditing({ ...editing, qual: e.target.value })} />
              </Field>
              <Field label="Registration No.">
                <Input value={editing.reg} onChange={(e) => setEditing({ ...editing, reg: e.target.value })} />
              </Field>
              <Field label="Tariff name">
                <Input defaultValue="Standard" />
              </Field>
              <Field label="Consultation charges (₹)">
                <Input type="number" value={editing.fee} onChange={(e) => setEditing({ ...editing, fee: Number(e.target.value) })} />
              </Field>
              <Field label="Follow-up charges (₹)">
                <Input type="number" value={editing.followFee} onChange={(e) => setEditing({ ...editing, followFee: Number(e.target.value) })} />
              </Field>
              <div className="md:col-span-2 flex items-center justify-between rounded-lg border bg-muted/30 p-3">
                <div>
                  <p className="text-sm font-medium">Active</p>
                  <p className="text-xs text-muted-foreground">Visible in registration and scheduling.</p>
                </div>
                <Switch checked={editing.active} onCheckedChange={(v) => setEditing({ ...editing, active: v })} />
              </div>
            </div>
          )}
          <SheetFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save}>Save Doctor</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </DashboardLayout>
  );
}

function Field({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}
