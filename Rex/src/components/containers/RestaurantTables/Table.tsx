import React from "react";
import { Button } from "@/components/ui/button";
import { createTicket } from "@/utils/ticketUtils";
import { Table } from "@/utils/tablesUtils";
import { useToast } from "@/components/ui/use-toast";

interface TableProps {
  table: Table;
  onClick: () => void;
  isSelected: boolean;
  onOpenEditor: (tableId: string) => void;
  onCloseTicket: (tableId: string) => void;
}

const DisplayedTable: React.FC<TableProps> = ({
  table,
  onClick,
  isSelected,
  onOpenEditor,
  onCloseTicket,
}) => {
  const { toast } = useToast();

  const handleCreateTicket = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await createTicket(table.table_id);
      toast({
        title: "Ticket creado",
        description: `Ticket creado para la mesa ${table.table_number}`,
        variant: "default",
      });
      onOpenEditor(table.table_id);
    } catch (error) {
      console.error("Error creating ticket:", error);
      toast({
        title: "Error al crear ticket",
        description:
          "Ocurrió un error al crear el ticket. Por favor, intente nuevamente.",
        variant: "destructive",
      });
    }
  };

  const handleCloseTicket = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCloseTicket(table.table_id);
  };

  const handleModify = (e: React.MouseEvent) => {
    e.stopPropagation();
    onOpenEditor(table.table_id);
  };

  const getStatusText = (
    status: number
  ): "Disponible" | "Ocupado" | "Reservado" => {
    switch (status) {
      case 0:
        return "Disponible";
      case 1:
        return "Ocupado";
      case 2:
        return "Reservado";
      default:
        return "Disponible";
    }
  };

  const getStatusColors = (status: number) => {
    switch (status) {
      case 0:
        return "bg-green-700 border-green-600 hover:border-green-600";
      case 1:
        return "bg-orange-700 border-orange-600 hover:border-orange-600";
      case 2:
        return "bg-yellow-700 border-yellow-600 hover:border-yellow-600";
      default:
        return "bg-green-700 border-green-600 hover:border-green-600";
    }
  };

  const status = getStatusText(table.status);
  const statusColors = getStatusColors(table.status);

  return (
    <div
      role="button"
      tabIndex={0}
      className={`relative rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200 cursor-pointer border-2 ${statusColors} ${
        isSelected ? "ring-2 ring-indigo-200" : ""
      }`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick();
        }
      }}
    >
      <div className="flex flex-col items-center space-y-2">
        <h3 className="text-lg font-semibold text-white">
          Mesa {table.table_number}
        </h3>
        <span
          className={`px-2 py-1 rounded-full text-sm font-medium ${
            status === "Disponible"
              ? "bg-green-100 text-green-800"
              : status === "Ocupado"
              ? "bg-orange-100 text-orange-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {status}
        </span>
        <div className="flex space-x-2 mt-2">
          {(status === "Disponible" || status === "Reservado") && (
            <Button
              variant="default"
              size="sm"
              onClick={handleCreateTicket}
              aria-label={`Crear ticket para mesa ${table.table_number}`}
            >
              Crear Ticket
            </Button>
          )}
          {status === "Ocupado" && (
            <>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleCloseTicket}
                aria-label={`Cerrar ticket de mesa ${table.table_number}`}
              >
                Cerrar Ticket
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleModify}
                aria-label={`Modificar ticket de mesa ${table.table_number}`}
              >
                Modificar
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DisplayedTable;
