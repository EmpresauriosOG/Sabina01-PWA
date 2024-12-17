import { Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AverageOrderTimes } from "@/hooks/tanstack/getAverageOrderTime";

interface AverageOrderTimesCardProps {
  data: AverageOrderTimes;
}

export function AverageOrderTimesCard({ data }: AverageOrderTimesCardProps) {
    // Helper function to format minutes to minutes and seconds
    const formatTime = (minutes: number) => {
      const wholeMinutes = Math.floor(minutes);
      const seconds = Math.round((minutes - wholeMinutes) * 60);
      
      if (wholeMinutes === 0) {
        return `${seconds} segundos`;
      }
      
      if (seconds === 0) {
        return `${wholeMinutes} ${wholeMinutes === 1 ? 'minuto' : 'minutos'}`;
      }
      
      return `${wholeMinutes}:${seconds.toString().padStart(2, '0')} min`;
    };

  // Time steps with their Spanish labels
  const timeSteps = [
    {
      label: "Orden a confirmación",
      value: data.avg_order_to_confirm,
      color: "text-blue-500"
    },
    {
      label: "Confirmación a preparación",
      value: data.avg_confirm_to_preparation,
      color: "text-yellow-500"
    },
    {
      label: "Preparación a servido",
      value: data.avg_preparation_to_serving,
      color: "text-green-500"
    },
    {
      label: "Servido a completado",
      value: data.avg_serving_to_completion,
      color: "text-purple-500"
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Tiempos de orden</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-yellow-500" />
          Tiempo total: {formatTime(data.avg_total_time)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3">
          {timeSteps.map((step, index) => (
            <div key={index} className="flex flex-col gap-0.5">
              <div className="text-xs text-muted-foreground">
                {step.label}
              </div>
              <div className="flex items-center gap-2">
                <Clock className={`h-3 w-3 ${step.color}`} />
                <div className="text-sm font-medium">
                  {formatTime(step.value)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}