import React from "react";
import { TableData } from "./RestaurantTables";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TableEditorProps {
  table: TableData;
  onUpdate: (updatedTable: TableData) => void;
  onDelete: (id: number) => void;
  onClose: () => void; // Add this line
}

const TableEditor: React.FC<TableEditorProps> = ({
  table,
  onUpdate,
  onDelete,
  onClose,
}) => {
  const [editedTable, setEditedTable] = React.useState<TableData>(table);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedTable({ ...editedTable, [name]: value });
  };

  const handleStatusChange = (value: string) => {
    setEditedTable({ ...editedTable, status: value as TableData["status"] });
  };

  const handleSave = () => {
    onUpdate(editedTable);
    onClose(); // Add this line to close the editor after saving
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Edit Table {table.id}</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <Select
            onValueChange={handleStatusChange}
            defaultValue={editedTable.status}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Persons</label>
          <Input
            type="number"
            name="persons"
            value={editedTable.persons}
            onChange={handleInputChange}
            min={1}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Names</label>
          {editedTable.names.map((name, index) => (
            <Input
              key={index}
              type="text"
              value={name}
              onChange={(e) => {
                const newNames = [...editedTable.names];
                newNames[index] = e.target.value;
                setEditedTable({ ...editedTable, names: newNames });
              }}
              className="mb-2"
            />
          ))}
          <Button
            onClick={() =>
              setEditedTable({
                ...editedTable,
                names: [...editedTable.names, ""],
              })
            }
            variant="outline"
            size="sm"
          >
            Add Name
          </Button>
        </div>
        <div className="flex justify-between mt-4">
          <Button onClick={handleSave}>Save Changes</Button>
          <Button onClick={() => onDelete(table.id)} variant="destructive">
            Delete Table
          </Button>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TableEditor;
