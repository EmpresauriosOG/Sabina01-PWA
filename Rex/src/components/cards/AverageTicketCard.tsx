import { Receipt } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AverageTicket } from "@/hooks/tanstack/getAverageTicket";

interface AverageTicketCardProps {
  data: AverageTicket;
}

export function AverageTicketCard({ data }: AverageTicketCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
        <CardDescription>{data.total_orders} tickets totales</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">
              ${data.average_ticket.toFixed(2)}
            </div>
            <Receipt className="h-4 w-4 text-blue-500" />
          </div>
          <p className="text-xs text-muted-foreground">
            ${data.total_revenue.toFixed(2)} en ingresos totales
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
