import { TrendingUp, TrendingDown } from "lucide-react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
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
import { Sales } from "@/hooks/tanstack/getSales";

const chartConfig = {
  sales: {
    label: "Ventas",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface SalesChartProps {
  data: Sales[];
}

export function SalesChart({ data }: SalesChartProps) {
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const calculateTrend = () => {
    if (sortedData.length < 2) return 0;
    const lastValue = sortedData[sortedData.length - 1].total_sales;
    const previousValue = sortedData[sortedData.length - 2].total_sales;
    return ((lastValue - previousValue) / previousValue) * 100;
  };
  
  const trendPercentage = calculateTrend();
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-2 flex-none">
        <CardTitle>Ventas</CardTitle>
        <CardDescription>
          Desempeño diario de ventas
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 min-h-0">
        <div className="w-full h-full" style={{ minHeight: "160px" }}>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%" minHeight={160}>
              <LineChart
                data={sortedData}
                margin={{
                  left: 0,
                  right: 0,
                  top: 5,
                  bottom: 35,
                }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={formatDate}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => `$${value}`}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                  formatter={(value: number) => [ "$",`${value}`]}
                />
                <Line
                  type="natural"
                  dataKey="total_sales"
                  stroke="var(--color-sales)"
                  strokeWidth={2}
                  dot={{
                    fill: "var(--color-sales)",
                  }}
                  activeDot={{
                    r: 6,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="pt-2 mt-2 border-t flex-none">
        <div className="flex w-full flex-col items-start gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            {trendPercentage > 0 ? (
              <>
                Incremento del {Math.abs(trendPercentage).toFixed(1)}% 
                <TrendingUp className="h-4 w-4 text-green-500" />
              </>
            ) : (
              <>
                Decremento del {Math.abs(trendPercentage).toFixed(1)}% 
                <TrendingDown className="h-4 w-4 text-red-500" />
              </>
            )}
          </div>
          <div className="leading-none text-muted-foreground">
            {formatDate(sortedData[0]?.date || '')} - {formatDate(sortedData[sortedData.length - 1]?.date || '')}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}