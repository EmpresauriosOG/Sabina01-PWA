import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
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
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Item } from "@/hooks/tanstack/getItems";

const chartConfig = {
  quantity: {
    label: "Cantidad",
    color: "hsl(var(--chart-1)",
  },
  revenue: {
    label: "Ingresos",
    color: "hsl(var(--chart-1)",
  },
} satisfies ChartConfig;

interface ItemsChartProps {
  data: Item[];
}

export function ItemsChart({ data }: ItemsChartProps) {
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("quantity");

  const chartData = React.useMemo(() => 
    data.map(item => ({
      name: item.dish_name,
      quantity: item.total_quantity,
      revenue: item.total_revenue
    }))
  , [data]);

  const total = React.useMemo(
    () => ({
      quantity: data.reduce((acc, curr) => acc + curr.total_quantity, 0),
      revenue: data.reduce((acc, curr) => acc + curr.total_revenue, 0),
    }),
    [data]
  );

  return (
    <Card>
      <CardHeader className="border-b p-0">
        <div className="flex flex-col w-full">
          <div className="p-4 sm:p-6">
            <CardTitle>Desempeño de Platillos</CardTitle>
          </div>
          <div className="flex flex-row flex-wrap border-t">
            {(Object.keys(chartConfig) as Array<keyof typeof chartConfig>).map((key) => (
              <button
                key={key}
                data-active={activeChart === key}
                className="flex-1 min-w-[120px] max-w-none flex flex-col justify-center gap-1 px-2 py-2 text-left even:border-l data-[active=true]:bg-muted/50 sm:px-3 sm:py-3"
                onClick={() => setActiveChart(key)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[key].label}
                </span>
                <span className="text-base font-bold leading-none sm:text-lg">
                  {key === 'revenue' 
                    ? `$${total[key].toLocaleString()}`
                    : total[key].toLocaleString()}
                </span>
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              bottom: 48, // increased bottom margin for rotated labels
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={16}
              interval={0}
              tick={{
                fontSize: 12,
                dominantBaseline: 'auto'
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey={activeChart}
                />
              }
            />
            <Bar 
              dataKey={activeChart} 
              fill={`hsl(var(--chart-1)`}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}