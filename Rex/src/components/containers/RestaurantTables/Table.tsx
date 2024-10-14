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
    0: "border-green-500",
    1: "border-red-500",
    2: "border-yellow-500",
  };

  return (
    <div
      className={cn(
        "w-full max-w-xs p-4 m-2 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all border-4",
        statusColors[table.status],
        isSelected && "ring-4 ring-blue-500"
      )}
      onClick={onClick}
    >
      <h2 className=" text-lg text-center mb-2">Mesa {table.table_number}</h2>
      <span className="text-sm">{table.number_of_persons} Personas</span>
      <span className="text-sm">Status: {table.status}</span>
      <span className="text-sm">Mesero: {table.current_waiter}</span>
    </div>
  );
};

export default DisplayedTable;
