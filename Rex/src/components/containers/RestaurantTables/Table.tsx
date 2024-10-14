import React from "react";
import { cn } from "@/lib/utils";
import { Table } from "@/utils/tablesUtils";

interface TableProps {
  table: Table;
  onClick: () => void;
  isSelected: boolean;
}

const DisplayedTable: React.FC<TableProps> = ({
  table,
  onClick,
  isSelected,
}) => {
  const statusColors: { [key: number]: string } = {
    0: "bg-green-500",
    1: "bg-red-500",
    2: "bg-yellow-500",
  };

  return (
    <div
      className={cn(
        "w-24 h-24 m-2 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all",
        statusColors[table.status],
        isSelected && "ring-4 ring-blue-500"
      )}
      onClick={onClick}
    >
      <span className="font-bold text-white">Mesa {table.table_number}</span>
      <span className="text-sm text-white">
        {table.number_of_persons} Personas
      </span>
    </div>
  );
};

export default DisplayedTable;
