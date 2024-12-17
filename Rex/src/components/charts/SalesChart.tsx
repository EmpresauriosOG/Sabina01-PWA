import { TrendingUp, TrendingDown } from "lucide-react";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [timeRange, setTimeRange] = useState("all");
  
  // Filter data based on selected time range
  const getFilteredData = () => {
    const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    if (timeRange === "all") return sortedData;
    
    const lastDate = new Date(sortedData[sortedData.length - 1]?.date || new Date());
    const startDate = new Date(lastDate);
    
    if (timeRange === "3m") {
      startDate.setMonth(startDate.getMonth() - 3);
    } else if (timeRange === "1m") {
      startDate.setMonth(startDate.getMonth() - 1);
    }
    
    return sortedData.filter(item => new Date(item.date) >= startDate);
  };
  
  const filteredData = getFilteredData();
  
  const calculateTrend = () => {
    if (filteredData.length < 2) return 0;
    const lastValue = filteredData[filteredData.length - 1].total_sales;
    const previousValue = filteredData[filteredData.length - 2].total_sales;
    return ((lastValue - previousValue) / previousValue) * 100;
  };
  
  const trendPercentage = calculateTrend();
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Ventas</CardTitle>
          <CardDescription>
            Desempeño diario de ventas
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Seleccionar periodo"
          >
            <SelectValue placeholder="Todo el tiempo" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="all" className="rounded-lg">
              Todo el tiempo
            </SelectItem>
            <SelectItem value="3m" className="rounded-lg">
              Últimos 3 meses
            </SelectItem>
            <SelectItem value="1m" className="rounded-lg">
              Último mes
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="w-full h-full" style={{ minHeight: "160px" }}>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%" minHeight={160}>
              <LineChart
                data={filteredData}
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
                  minTickGap={32}
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
                  formatter={(value: number) => [`$${value}`, ""]}
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
            {formatDate(filteredData[0]?.date || '')} - {formatDate(filteredData[filteredData.length - 1]?.date || '')}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}