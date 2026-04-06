import { Pie, PieChart, ResponsiveContainer, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { OrderStatus, STATUS_MAPPING } from "@/hooks/tanstack/getOrderStatus";

interface OrderStatusChartProps {
  data: OrderStatus[];
}

const chartConfig = Object.entries(STATUS_MAPPING).reduce(
  (config, [status, { label, color }]) => ({
    ...config,
    [status]: {
      label,
      color,
    },
  }),
  {}
) satisfies ChartConfig;

export function OrderStatusChart({ data }: OrderStatusChartProps) {
  const chartData = data.map((item) => ({
    status: item.status,
    count: item.count,
    name: STATUS_MAPPING[item.status]?.label || `Status ${item.status}`,
    fill: STATUS_MAPPING[item.status]?.color || "hsl(var(--chart-6))",
  }));

  const totalOrders = data.reduce((sum, item) => sum + item.count, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Distribución de Órdenes</CardTitle>
        <CardDescription>Total de órdenes: {totalOrders}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    //@ts-expect-error: valueFormatter expects a number but receives a string
                    valueFormatter={(value) => {
                      const percentage = (
                        ((value as number) / totalOrders) *
                        100
                      ).toFixed(1);
                      return `${value} (${percentage}%)`;
                    }}
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="count"
                nameKey="name"
                innerRadius="60%"
                outerRadius="80%"
                paddingAngle={2}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex justify-center gap-4 pt-4">
        {chartData.map((entry) => (
          <div key={entry.status} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.fill }}
            />
            <span className="text-sm text-muted-foreground">{entry.name}</span>
          </div>
        ))}
      </CardFooter>
    </Card>
  );
}
