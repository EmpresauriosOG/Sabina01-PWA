import { useState } from "react";
import DisplayedTable from "./Table";
import TableEditor from "./TableEditor";
import SpaceSelector from "./SpaceSelector";
import {
  addRestaurantSpace,
  addRestaurantTable,
  deleteRestaurantSpace,
  deleteRestaurantTable,
  Table,
  TablesResponse,
} from "@/utils/tablesUtils";
import { Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface RestaurantTablesProps {
  tableData: TablesResponse;
  restaurantId?: string;
  locationId?: string;
  refetchTables: () => void;
}

const RestaurantTables = (props: RestaurantTablesProps) => {
  const data = props.tableData;
  const { toast } = useToast();
  const [selectedSpace, setSelectedSpace] = useState<string | null>(
    data.spaces[0]?.name
  );
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const displayedTables = data.spaces.find(
    (space) => space.name === selectedSpace
  )?.tables;

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

  //add a new table
  const addTable = async () => {
    console.log(props.tableData.spaces)
    await addRestaurantTable(
      props.restaurantId || "",
      props.locationId || "",
      selectedSpace || "",
      (props.tableData.spaces.find((space) => space.name === selectedSpace)
        ?.tables.length ?? 0) + 1
    );
    props.refetchTables();
  };

  return (
    <div className="w-full mx-auto px-4 py-4">
      <h1 className="text-2xl font-bold mb-4">Gestiona tus espacios</h1>
      <SpaceSelector
        spaces={data.spaces}
        selectedSpace={selectedSpace}
        onSpaceSelect={setSelectedSpace}
        onAddSpace={addSpace}
        onDeleteSpace={deleteSpace}
      />
      <div className="flex flex-col md:flex-row flex-1 overflow-auto ">
        <div className="w-full md:w-2/3 pr-0 md:pr-4 mb-4 md:mb-0 dark:bg-neutral-900 shadow-md rounded-md mr-4">
          {/* //ToDo add a component for empty spaces */}
          {data.spaces.length === 0 && (
            <div>
              <p className="text-white text-center p-4">
                No hay espacios en este restaurante...
              </p>
            </div>
          )}
          {selectedSpace && (
            <div>
              <Button
                onClick={() => {
                  toast({
                    title: "Estas agregando una mesa en " + selectedSpace,
                    description: "Confirma para proceder",
                    action: (
                      <>
                        <ToastAction altText="Cancelar">Cancelar</ToastAction>
                        <ToastAction onClick={addTable} altText="Agregar">
                          Agregar
                        </ToastAction>
                      </>
                    ),
                  });
                }}
                className="mb-4 ml-4 mt-4"
              >
                Agrega una mesa
              </Button>
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
              key={selectedTable.table_id}
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
