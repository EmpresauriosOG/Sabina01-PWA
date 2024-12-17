import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts";
import { useState } from "react";
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
import { TimeRangeSelect } from "./reusableComponents/TimeRangeSelect";
import { HourlyData } from "@/hooks/tanstack/getBusiestHours";


interface BusiestHoursChartProps {
  data: HourlyData[];
}

interface CustomLabelProps {
  x: number;
  y: number;
  value: number;
  width: number;
  height: number;
  offset?: number;
}

const chartConfig = {
  orders: {
    label: "Órdenes",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function BusiestHoursChart({ data }: BusiestHoursChartProps) {
  const [timeRange, setTimeRange] = useState("all");

  // Format hour in 24-hour format with leading zero
  const formatHour = (hour: number) => {
    return hour.toString().padStart(2, '0');
  };

  // Filter data based on selected time range
  const getFilteredData = () => {
    const startDate = new Date();
    
    if (timeRange === "3m") {
      startDate.setMonth(startDate.getMonth() - 3);
    } else if (timeRange === "1m") {
      startDate.setMonth(startDate.getMonth() - 1);
    }
    
    return data;
  };

  const filteredData = getFilteredData();

  // Create complete data array with all hours
  const chartData = Array.from({ length: 24 }, (_, index) => {
    const existingData = filteredData.find(item => item.hour === index);
    return {
      hour: index,
      order_count: existingData?.order_count || 0
    };
  });

  // Calculate total orders
  const totalOrders = filteredData.reduce((sum, item) => sum + item.order_count, 0);

  // Custom label component that only shows non-zero values
  const CustomLabel = ({ x, y, width, value }: CustomLabelProps) => {
    if (value === 0) return null;
    return (
      <text
        x={x + (width / 2)}
        y={y - 10}
        fill="currentColor"
        fontSize={12}
        textAnchor="middle"
        className="fill-foreground"
      >
        {value}
      </text>
    );
  };

  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Horas más ocupadas</CardTitle>
          <CardDescription>
            Total de {totalOrders} órdenes
          </CardDescription>
        </div>
        <TimeRangeSelect value={timeRange} onValueChange={setTimeRange} />
      </CardHeader>
      <CardContent className="flex-1 min-h-0 px-2 pt-4 sm:px-6 sm:pt-6">
        <div className="w-full h-full" style={{ minHeight: "160px" }}>
          <ChartContainer config={chartConfig}>
            <ResponsiveContainer width="100%" height="100%" minHeight={160}>
              <BarChart
                data={chartData}
                margin={{
                  top: 20,
                  right: 0,
                  left: 0,
                  bottom: 35,
                }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="hour"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={16}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  tickFormatter={formatHour}
                  fontSize={12}
                  height={60}
                />
                <ChartTooltip
                  cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                  content={<ChartTooltipContent />}
                  formatter={(value: number) => value > 0 ? [`${value} órdenes`] : ['-', 'Órdenes']}
                />
                <Bar 
                  dataKey="order_count" 
                  fill="var(--color-orders)" 
                  radius={[4, 4, 0, 0]}
                  label={(props: CustomLabelProps) => <CustomLabel {...props} />}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}