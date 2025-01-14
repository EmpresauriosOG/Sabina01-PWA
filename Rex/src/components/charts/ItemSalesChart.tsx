import * as React from "react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart";
import { DailySales } from "@/hooks/tanstack/getItemSales";

interface ItemSalesChartProps {
  data: DailySales[];
}

const chartConfig = {
  sales: {
    label: "Ventas",
    color: "hsl(var(--chart-1))",
  },
  quantity: {
    label: "Cantidad",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

type MetricType = "sales" | "quantity";

export function ItemSalesChart({ data }: ItemSalesChartProps) {
  const [activeMetric, setActiveMetric] = React.useState<MetricType>("sales");

  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  // Transform data for the chart
  const chartData = sortedData.map(day => ({
    date: day.date,
    sales: day.items.reduce((sum, item) => sum + item.sales, 0),
    quantity: day.items.reduce((sum, item) => sum + item.quantity, 0),
    items: day.items // Keep original items for tooltip
  }));

  const totals = React.useMemo(
    () => ({
      sales: chartData.reduce((acc, curr) => acc + curr.sales, 0),
      quantity: chartData.reduce((acc, curr) => acc + curr.quantity, 0),
    }),
    [chartData]
  );

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-MX", {
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Ventas por Producto</CardTitle>
          <CardDescription>
            Desempeño diario de ventas por producto
          </CardDescription>
        </div>
        <div className="flex">
          {(["sales", "quantity"] as const).map((metric) => (
            <button
              key={metric}
              data-active={activeMetric === metric}
              className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
              onClick={() => setActiveMetric(metric)}
            >
              <span className="text-xs text-muted-foreground">
                {metric === "sales" ? "Ventas" : "Cantidad"}
              </span>
              <span className="text-lg font-bold leading-none sm:text-3xl">
                {metric === "sales" 
                  ? `$${totals[metric].toLocaleString()}`
                  : totals[metric].toLocaleString()}
              </span>
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            data={chartData}
            margin={{
              left: 0,
              right: 0,
              top: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={formatDate}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => 
                activeMetric === "sales" ? `$${value}` : value.toString()
              }
            />
            <ChartTooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const dayData = chartData.find(d => d.date === label);
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid gap-2">
                        <div className="font-medium">{formatDate(label)}</div>
                        {dayData?.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between gap-8">
                            <span>{item.dish_name}</span>
                            <div className="flex gap-4">
                              <span>${item.sales}</span>
                              <span>{item.quantity} unid.</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey={activeMetric}
              stroke={`var(--color-${activeMetric})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}