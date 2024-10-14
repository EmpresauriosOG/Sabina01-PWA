import { useState } from "react";
import DisplayedTable from "./Table";
import TableEditor from "./TableEditor";
import SpaceSelector from "./SpaceSelector";
import {
  addRestaurantSpace,
  deleteRestaurantSpace,
  deleteRestaurantTable,
  Table,
  TablesResponse,
} from "@/utils/tablesUtils";
import { Wind } from "lucide-react";

interface RestaurantTablesProps {
  tableData: TablesResponse;
  restaurantId?: string;
  locationId?: string;
  refetchTables: () => void;
}

const RestaurantTables = (props: RestaurantTablesProps) => {
  const data = props.tableData;
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const displayedTables = data.spaces.find(
    (space) => space.name === selectedSpace
  )?.tables;

  // const addTable = async (spaceName: string, tableNumber: number) => {
  //   await addRestaurantTable(
  //     props.restaurantId || "",
  //     props.locationId || "",
  //     spaceName,
  //     tableNumber
  //   );
  //   props.refetchTables();
  // };

  // Add a new space
  const addSpace = async (name: string) => {
    await addRestaurantSpace(
      props.restaurantId || "",
      props.locationId || "",
      name,
      "waiter"
    );
    props.refetchTables();
  };

  // Delete a space and all its tables
  const deleteSpace = async (name: string) => {
    await deleteRestaurantSpace(
      props.restaurantId || "",
      props.locationId || "",
      name
    );
    props.refetchTables();
  };

  //Delete a Table
  const deleteTable = async (spaceName: string, tableNumber: number) => {
    await deleteRestaurantTable(
      props.restaurantId || "",
      props.locationId || "",
      spaceName,
      tableNumber
    );
    props.refetchTables();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Gestiona tu restaurante</h1>
      <SpaceSelector
        spaces={data.spaces}
        selectedSpace={selectedSpace}
        onSpaceSelect={setSelectedSpace}
        onAddSpace={addSpace}
        onDeleteSpace={deleteSpace}
      />
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-2/3 pr-0 md:pr-4 mb-4 md:mb-0">
          {selectedSpace && (
            <div>
              {/* <Button onClick={addTable(props.restaurantId, props.locationId, )} className="mb-4">
                Agrega una mesa
              </Button> */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {displayedTables &&
                  displayedTables.length > 0 &&
                  displayedTables.map((table) => (
                    <DisplayedTable
                      key={table.table_id}
                      table={table}
                      onClick={() => setSelectedTable(table)}
                      isSelected={selectedTable?.table_id === table.table_id}
                    />
                  ))}
                {displayedTables && displayedTables.length === 0 && (
                  <div className="col-span-2 sm:col-span-3 md:col-span-4 lg:col-span-5 flex items-center justify-center h-full">
                    No hay mesas en este espacio... <Wind />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="w-full md:w-1/3">
          {selectedTable && (
            <TableEditor
              table={selectedTable}
              locationId={props.locationId || ""}
              restaurantId={props.restaurantId || ""}
              spaceName={selectedSpace || ""}
              refetchTables={props.refetchTables}
              onDelete={() => {
                deleteTable(selectedSpace || "", selectedTable.table_number);
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
