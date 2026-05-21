import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Printer, Save, Search, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { DashboardLayout } from "@/components/dashboard-layout";

export const Route = createFileRoute("/patients/register")({
  head: () => ({
    meta: [
      { title: "Express Registration — MediCore HMS" },
      { name: "description", content: "Fast OPD patient registration with mobile lookup, doctor filtering, and instant receipt." },
    ],
  }),
  component: PatientRegister,
});

const departments = [
  { id: "cardio", name: "Cardiology" },
  { id: "ortho", name: "Orthopedics" },
  { id: "ped", name: "Pediatrics" },
  { id: "neuro", name: "Neurology" },
  { id: "derma", name: "Dermatology" },
  { id: "ent", name: "ENT" },
];

const doctors = [
  { id: "d1", name: "Dr. Mehta", dept: "cardio", fee: 800 },
  { id: "d2", name: "Dr. Iyer", dept: "ped", fee: 500 },
  { id: "d3", name: "Dr. Singh", dept: "ortho", fee: 700 },
  { id: "d4", name: "Dr. Khan", dept: "derma", fee: 600 },
  { id: "d5", name: "Dr. Bose", dept: "neuro", fee: 1200 },
  { id: "d6", name: "Dr. Rao", dept: "ent", fee: 550 },
];

const existing: Record<string, { first: string; last: string; gender: string; dob: string; email: string; address: string }> = {
  "9876543210": {
    first: "Aarav", last: "Sharma", gender: "Male", dob: "1992-04-15",
    email: "aarav@example.com", address: "12, MG Road, Bengaluru",
  },
};

function calcAge(dob: string) {
  if (!dob) return "";
  const d = new Date(dob);
  if (isNaN(d.getTime())) return "";
  const diff = Date.now() - d.getTime();
  return String(Math.floor(diff / (365.25 * 24 * 3600 * 1000)));
}

function PatientRegister() {
  const [mobile, setMobile] = useState("");
  const [prefix, setPrefix] = useState("Mr");
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [gender, setGender] = useState("Male");
  const [dob, setDob] = useState("");
  const [age, setAge] = useState("");
  const [dept, setDept] = useState("");
  const [doctor, setDoctor] = useState("");
  const [service, setService] = useState("Consultation");
  const [patientType] = useState("Self Pay");
  const [payment, setPayment] = useState("Cash");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [opdNo] = useState(() => `OPD-${Math.floor(20000 + Math.random() * 9999)}`);
  const [showExisting, setShowExisting] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  useEffect(() => setAge(calcAge(dob)), [dob]);

  const filteredDoctors = useMemo(
    () => (dept ? doctors.filter((d) => d.dept === dept) : doctors),
    [dept],
  );
  const selectedDoctor = doctors.find((d) => d.id === doctor);
  const fee = selectedDoctor?.fee ?? 0;

  const lookupMobile = () => {
    if (existing[mobile]) {
      setShowExisting(true);
    } else if (mobile.length >= 10) {
      toast.info("No existing record. Continue as new patient.");
    } else {
      toast.error("Enter a valid 10-digit mobile number.");
    }
  };

  const applyExisting = () => {
    const e = existing[mobile];
    if (!e) return;
    setFirst(e.first); setLast(e.last); setGender(e.gender);
    setDob(e.dob); setEmail(e.email); setAddress(e.address);
    setShowExisting(false);
    toast.success("Patient details autofilled.");
  };

  const register = () => {
    if (!first || !mobile || !doctor) {
      toast.error("Mobile, name and doctor are required.");
      return;
    }
    setShowReceipt(true);
    toast.success(`Registered ${opdNo}`);
  };

  return (
    <DashboardLayout
      title="Express Patient Registration"
      subtitle="One-page intake optimized for the front desk."
      actions={
        <Badge variant="secondary" className="font-mono text-xs">
          {opdNo}
        </Badge>
      }
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Patient Lookup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                    onKeyDown={(e) => e.key === "Enter" && lookupMobile()}
                    placeholder="Enter mobile number (try 9876543210)"
                    className="h-11 pl-9 text-base"
                    inputMode="numeric"
                  />
                </div>
                <Button onClick={lookupMobile} className="h-11">
                  <Search className="h-4 w-4" /> Search
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Tip: press <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px]">Enter</kbd> to search.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Patient Details</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-6">
                <Field label="Prefix" className="md:col-span-1">
                  <Select value={prefix} onValueChange={setPrefix}>
                    <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Mr", "Mrs", "Ms", "Dr", "Master", "Baby"].map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="First name *" className="md:col-span-2">
                  <Input className="h-10" value={first} onChange={(e) => setFirst(e.target.value)} />
                </Field>
                <Field label="Last name" className="md:col-span-3">
                  <Input className="h-10" value={last} onChange={(e) => setLast(e.target.value)} />
                </Field>

                <Field label="Gender" className="md:col-span-2">
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Male", "Female", "Other"].map((g) => (
                        <SelectItem key={g} value={g}>{g}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Date of birth" className="md:col-span-2">
                  <Input type="date" className="h-10" value={dob} onChange={(e) => setDob(e.target.value)} />
                </Field>
                <Field label="Age" className="md:col-span-2">
                  <Input className="h-10" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Auto" />
                </Field>

                <Field label="Email" className="md:col-span-3">
                  <Input type="email" className="h-10" value={email} onChange={(e) => setEmail(e.target.value)} />
                </Field>
                <Field label="Aadhaar" className="md:col-span-3">
                  <Input className="h-10" value={aadhaar} onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, "").slice(0, 12))} />
                </Field>

                <Field label="Address" className="md:col-span-6">
                  <Textarea rows={2} value={address} onChange={(e) => setAddress(e.target.value)} />
                </Field>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3"><CardTitle className="text-base">Visit & Billing</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-6">
                <Field label="Department" className="md:col-span-2">
                  <Select value={dept} onValueChange={(v) => { setDept(v); setDoctor(""); }}>
                    <SelectTrigger className="h-10"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {departments.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Doctor" className="md:col-span-2">
                  <Select value={doctor} onValueChange={setDoctor}>
                    <SelectTrigger className="h-10"><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {filteredDoctors.map((d) => (
                        <SelectItem key={d.id} value={d.id}>
                          <span className="inline-flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-success" />
                            {d.name}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Service" className="md:col-span-2">
                  <Select value={service} onValueChange={setService}>
                    <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Consultation", "Follow-up", "Procedure"].map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field label="Patient type" className="md:col-span-2">
                  <Input className="h-10" value={patientType} readOnly />
                </Field>
                <Field label="Consultation fee" className="md:col-span-2">
                  <Input className="h-10 font-medium" value={fee ? `₹ ${fee}` : ""} readOnly />
                </Field>
                <Field label="Payment mode" className="md:col-span-2">
                  <Select value={payment} onValueChange={setPayment}>
                    <SelectTrigger className="h-10"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Cash", "Card", "UPI", "Net Banking"].map((p) => (
                        <SelectItem key={p} value={p}>{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="sticky top-20">
            <CardHeader className="pb-3"><CardTitle className="text-base">Receipt Summary</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <Row k="OPD No." v={<span className="font-mono">{opdNo}</span>} />
              <Row k="Patient" v={`${prefix} ${first || "—"} ${last}`.trim()} />
              <Row k="Mobile" v={mobile || "—"} />
              <Row k="Doctor" v={selectedDoctor?.name ?? "—"} />
              <Row k="Service" v={service} />
              <Separator />
              <Row k="Consultation" v={fee ? `₹ ${fee}` : "₹ 0"} />
              <Row k="Payment" v={payment} />
              <Separator />
              <div className="flex items-center justify-between text-base font-semibold">
                <span>Total</span>
                <span>₹ {fee}</span>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button className="h-11" onClick={register}>
                  <Save className="h-4 w-4" /> Register & Print Receipt
                </Button>
                <Button variant="outline" className="h-11" onClick={() => setShowReceipt(true)}>
                  <Printer className="h-4 w-4" /> Preview Receipt
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                SMS confirmation will be sent to <span className="font-medium">{mobile || "the patient"}</span>.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={showExisting} onOpenChange={setShowExisting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-success" /> Existing patient found
            </DialogTitle>
            <DialogDescription>
              {existing[mobile]?.first} {existing[mobile]?.last} is already registered with this mobile number. Autofill details?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExisting(false)}>Continue as new</Button>
            <Button onClick={applyExisting}>Autofill</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Receipt Preview</DialogTitle>
          </DialogHeader>
          <div className="rounded-lg border bg-card p-4 font-mono text-xs">
            <div className="text-center">
              <p className="text-sm font-semibold">MediCore Hospital</p>
              <p className="text-muted-foreground">OPD Consultation Receipt</p>
            </div>
            <Separator className="my-3" />
            <Row k="OPD No." v={opdNo} mono />
            <Row k="Date" v={new Date().toLocaleString()} mono />
            <Row k="Patient" v={`${prefix} ${first} ${last}`} mono />
            <Row k="Mobile" v={mobile} mono />
            <Row k="Doctor" v={selectedDoctor?.name ?? "—"} mono />
            <Row k="Service" v={service} mono />
            <Separator className="my-2" />
            <Row k="Total" v={`₹ ${fee}`} mono />
            <Row k="Mode" v={payment} mono />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReceipt(false)}>Close</Button>
            <Button onClick={() => window.print()}>
              <Printer className="h-4 w-4" /> Print
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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

function Row({ k, v, mono }: { k: string; v: React.ReactNode; mono?: boolean }) {
  return (
    <div className={`flex items-center justify-between gap-3 ${mono ? "py-0.5" : ""}`}>
      <span className="text-muted-foreground">{k}</span>
      <span className="text-right font-medium">{v}</span>
    </div>
  );
}
