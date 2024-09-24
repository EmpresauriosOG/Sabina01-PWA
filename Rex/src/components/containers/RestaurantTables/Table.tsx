import React from "react";
import { TableData } from "./RestaurantTables";
import { cn } from "@/lib/utils";

interface TableProps {
  table: TableData;
  onClick: () => void;
  isSelected: boolean;
}

const Table: React.FC<TableProps> = ({ table, onClick, isSelected }) => {
  const statusColors = {
    available: "bg-green-500",
    occupied: "bg-red-500",
    reserved: "bg-yellow-500",
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
      <span className="font-bold text-white">Table {table.id}</span>
      <span className="text-sm text-white">{table.persons} persons</span>
    </div>
  );
};

export default Table;
