import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "../ColumnHeader";
import { Ingredient } from "./types";
import ModifyButton from "./ModifyButton";
import DeleteIngredientToast from "./DeleteIngredient";

//@Braun Check styles
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
    cell: ({ row }) => {
      const data = row.original;
      return (
        //@Braun Check styles
        <>
          <DeleteIngredientToast item={row.getValue("id")} />
          <ModifyButton
            dialogTitle="Modificar Ingrediente"
            dialogDescription="Ingresa"
            item={{ ...data, itemName: "ingredient" } as Ingredient}
          />
        </>
      );
    },
  },
];
