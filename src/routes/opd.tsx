import { createFileRoute, Link } from "@tanstack/react-router";
import { Construction } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

function Stub({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <DashboardLayout title={title} subtitle={subtitle}>
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="rounded-full bg-secondary p-3 text-primary">
            <Construction className="h-6 w-6" />
          </div>
          <div>
            <p className="text-base font-semibold">Module coming next</p>
            <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
              This module is part of the MediCore roadmap. Reception flows, registration,
              doctor master and core admin masters are live today.
            </p>
          </div>
          <Button asChild size="sm">
            <Link to="/">Back to dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}

export const Route = createFileRoute("/opd")({
  head: () => ({ meta: [{ title: "OPD — MediCore HMS" }] }),
  component: () => <Stub title="OPD" subtitle="Outpatient queue, consultations and prescriptions." />,
});
