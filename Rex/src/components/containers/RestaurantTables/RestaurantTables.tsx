import React, { useState } from "react";
import Table from "./Table";
import TableEditor from "./TableEditor";
import SpaceSelector from "./SpaceSelector";
import { Button } from "@/components/ui/button";

export interface TableData {
  id: number;
  status: "available" | "occupied" | "reserved";
  color: string;
  persons: number;
  names: string[];
  spaceId: string;
}

export interface Space {
  id: string;
  name: string;
}

const RestaurantTables: React.FC = () => {
  const [tables, setTables] = useState<TableData[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);

  const addTable = (spaceId: string) => {
    const newTable: TableData = {
      id: Date.now(),
      status: "available",
      color: "#4CAF50", // Default green color
      persons: 2,
      names: ["Guest 1", "Guest 2"],
      spaceId,
    };
    setTables([...tables, newTable]);
  };

  const deleteTable = (id: number) => {
    setTables(tables.filter((table) => table.id !== id));
  };

  const updateTable = (updatedTable: TableData) => {
    setTables(
      tables.map((table) =>
        table.id === updatedTable.id ? updatedTable : table
      )
    );
  };

  const addSpace = (name: string) => {
    const newSpace: Space = { id: Date.now().toString(), name };
    setSpaces([...spaces, newSpace]);
  };

  const deleteSpace = (id: string) => {
    setSpaces(spaces.filter((space) => space.id !== id));
    setTables(tables.filter((table) => table.spaceId !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Restaurant Tables</h1>
      <SpaceSelector
        spaces={spaces}
        selectedSpace={selectedSpace}
        onSpaceSelect={setSelectedSpace}
        onAddSpace={addSpace}
        onDeleteSpace={deleteSpace}
      />
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-2/3 pr-0 md:pr-4 mb-4 md:mb-0">
          {selectedSpace && (
            <div>
              <Button onClick={() => addTable(selectedSpace)} className="mb-4">
                Add Table
              </Button>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {tables
                  .filter((table) => table.spaceId === selectedSpace)
                  .map((table) => (
                    <Table
                      key={table.id}
                      table={table}
                      onClick={() => setSelectedTable(table)}
                      isSelected={selectedTable?.id === table.id}
                    />
                  ))}
              </div>
            </div>
          )}
        </div>
        <div className="w-full md:w-1/3">
          {selectedTable && (
            <TableEditor
              table={selectedTable}
              onUpdate={(updatedTable) => {
                updateTable(updatedTable);
                setSelectedTable(null);
              }}
              onDelete={(id) => {
                deleteTable(id);
                setSelectedTable(null);
              }}
              onClose={() => setSelectedTable(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantTables;
