import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, updateRestaurantTable } from "@/utils/tablesUtils";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface TableEditorProps {
  table: Table;
  restaurantId: string;
  locationId: string;
  spaceId: string;
  onDelete: (id: string) => void;
  onClose: () => void;
  refetchTables: () => void;
}

const TableEditor: React.FC<TableEditorProps> = ({
  table,
  onDelete,
  onClose,
  refetchTables,
  restaurantId,
  locationId,
  spaceId,
}) => {
  const [editedTable, setEditedTable] = React.useState<Table>(table);

  const updateTable = async (updatedTable: Table) => {
    await updateRestaurantTable(
      restaurantId,
      locationId,
      spaceId,
      updatedTable.table_id,
      updatedTable.current_waiter ?? undefined,
      updatedTable.guest_names,
      updatedTable.number_of_persons,
      updatedTable.status
    );
    refetchTables(); // Add this line to refetch tables after updating
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedTable({ ...editedTable, [name]: value });
  };

  const handleStatusChange = (value: string) => {
    setEditedTable({ ...editedTable, status: parseInt(value) });
  };

  const handleSave = () => {
    updateTable(editedTable);
    onClose(); // Close the editor after saving
  };

  const { toast } = useToast();

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Mesa {table.table_number}</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <Select
            onValueChange={handleStatusChange}
            defaultValue={editedTable.status.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Cambia el status de la mesa" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Disponible</SelectItem>
              <SelectItem value="1">Ocupado</SelectItem>
              <SelectItem value="2">Reservado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Mesero</label>
          <Input
            type="string"
            name="current_waiter"
            value={editedTable.current_waiter ?? ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Personas</label>
          <Input
            type="number"
            name="number_of_persons"
            value={editedTable.number_of_persons}
            onChange={handleInputChange}
            min={1}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nombres</label>
          {editedTable.guest_names.map((name, index) => (
            <Input
              key={index}
              type="text"
              value={name}
              onChange={(e) => {
                const newNames = [...editedTable.guest_names];
                newNames[index] = e.target.value;
                setEditedTable({ ...editedTable, guest_names: newNames });
              }}
              className="mb-2"
            />
          ))}
          <Button
            onClick={() =>
              setEditedTable({
                ...editedTable,
                guest_names: [...editedTable.guest_names, ""],
              })
            }
            variant="outline"
            size="sm"
          >
            Agregar Nombre
          </Button>
        </div>
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-between">
          <Button className="w-full sm:w-auto" onClick={handleSave}>
            Guardar
          </Button>
          <Button
            className="w-full sm:w-auto"
            onClick={() => {
              toast({
                variant: "destructive",
                title: "Estas seguro?",
                description: "Mesa: " + table.table_number + " sera eliminado",
                action: (
                  <>
                    <ToastAction altText="Cancelar">Cancelar</ToastAction>
                    <ToastAction
                      onClick={() => onDelete(table.table_id)}
                      altText="Eliminar"
                    >
                      Eliminar
                    </ToastAction>
                  </>
                ),
              });
            }}
            variant="destructive"
          >
            Borrar Mesa
          </Button>
          <Button className="w-full sm:w-auto" onClick={onClose} variant="outline">
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TableEditor;
