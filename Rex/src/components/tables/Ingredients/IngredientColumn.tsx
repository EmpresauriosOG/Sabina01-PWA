/* eslint-disable react-refresh/only-export-components */
import { ColumnDef, Row } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../ColumnHeader";
import { Ingredient } from "./types";
import ModifyButton from "./ModifyButton";
import DeleteToast from "../DeleteToast";
import { deleteIngredient } from "@/utils/ingredientUtils";
import { useQueryClient } from "@tanstack/react-query";

//@Braun Check styles
const IngredientActionsCell = ({ row }: { row: Row<Ingredient> }) => {
  const queryClient = useQueryClient();
  const data = row.original;

  const invalidateIngredientQuery = async () => {
    if (data.restaurant_id && data.location_id) {
      await queryClient.invalidateQueries({
        queryKey: ["ingredient", data.restaurant_id, data.location_id],
      });
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ["ingredient"] });
  };

  return (
    //@Braun Check styles
    <>
      <DeleteToast
        item={row.getValue("id")}
        onDelete={async (id) => {
          await deleteIngredient(id);
          void invalidateIngredientQuery();
        }}
      />
      <ModifyButton
        dialogTitle="Modificar Ingrediente"
        dialogDescription="Ingresa"
        item={{ ...data, itemName: "ingredient" } as Ingredient}
      />
    </>
  );
};

export const columns: ColumnDef<Ingredient>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="nombre" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("type")}</div>
    ),
  },
  {
    accessorKey: "unit",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Unidad" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("unit")}</div>
    ),
  },
  {
    accessorKey: "stock",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="stock" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("stock")}</div>
    ),
  },
  {
    accessorKey: "expiration",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Expiracion" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("expiration")}</div>
    ),
  },
  {
    accessorKey: "id",
    header: () => <div>Opciones</div>,
    cell: ({ row }) => <IngredientActionsCell row={row} />,
  },
];
