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
    color: "hsl(var(--chart-1))",
  },
  revenue: {
    label: "Ingresos",
    color: "hsl(var(--chart-2))",
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
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Desempeño de Platillos</CardTitle>
          <CardDescription>
            Mostrando cantidad vendida e ingresos por platillo
          </CardDescription>
        </div>
        <div className="flex">
          {(Object.keys(chartConfig) as Array<keyof typeof chartConfig>).map((key) => (
            <button
              key={key}
              data-active={activeChart === key}
              className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
              onClick={() => setActiveChart(key)}
            >
              <span className="text-xs text-muted-foreground">
                {chartConfig[key].label}
              </span>
              <span className="text-lg font-bold leading-none sm:text-3xl">
                {key === 'revenue' 
                  ? `$${total[key].toLocaleString()}`
                  : total[key].toLocaleString()}
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
          <BarChart
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey={activeChart}
                  valueFormatter={(value) => 
                    activeChart === 'revenue' 
                      ? `$${value.toLocaleString()}`
                      : value.toLocaleString()
                  }
                />
              }
            />
            <Bar 
              dataKey={activeChart} 
              fill={`var(--color-${activeChart})`}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}