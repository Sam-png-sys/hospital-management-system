import { createFileRoute, Link } from "@tanstack/react-router";
import { Construction } from "lucide-react";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — MediCore HMS" }] }),
  component: () => (
    <DashboardLayout title="Settings" subtitle="Hospital profile, users and preferences.">
      <Card>
        <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <div className="rounded-full bg-secondary p-3 text-primary"><Construction className="h-6 w-6" /></div>
          <p className="text-base font-semibold">Module coming next</p>
          <Button asChild size="sm"><Link to="/">Back to dashboard</Link></Button>
        </CardContent>
      </Card>
    </DashboardLayout>
  ),
});
