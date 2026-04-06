import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeRangeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
}

export function TimeRangeSelect({ value, onValueChange }: TimeRangeSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
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
  );
}