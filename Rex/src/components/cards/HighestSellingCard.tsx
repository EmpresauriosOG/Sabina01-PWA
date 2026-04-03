import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HighestSellingItem } from "@/hooks/tanstack/getHighestSelling";

interface HighestSellingCardProps {
  data: HighestSellingItem;
}

export function HighestSellingCard({ data }: HighestSellingCardProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          Producto más vendido
        </CardTitle>
        <CardDescription>{data.dish_name}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">
              {data.total_quantity} unidades
            </div>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </div>
          <p className="text-xs text-muted-foreground">
            ${data.total_sales.toFixed(2)} en ventas totales
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
