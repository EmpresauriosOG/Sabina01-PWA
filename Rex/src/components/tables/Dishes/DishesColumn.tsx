/* eslint-disable react-refresh/only-export-components */
import { ColumnDef, Row } from "@tanstack/react-table";
import { MenuItem } from "@/components/tables/Dishes/types";
import { Checkbox } from "@/components/ui/checkbox";
import { updateMenuItem } from "@/utils/menuUtils";
import { DishIngredients } from "./DishIngredients";
import { ModifyDish } from "./ModifyDish";
import { DeleteDish } from "./DeleteDish";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const DishActiveCell = ({ row }: { row: Row<MenuItem> }) => {
  const queryClient = useQueryClient();
  const item = row.original;

  const invalidateMenuQuery = async () => {
    if (item.restaurant_id && item.location_id) {
      await queryClient.invalidateQueries({
        queryKey: ["menu", item.restaurant_id, item.location_id],
      });
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ["menu"] });
  };

  return (
    <Checkbox
      checked={item.is_active === 1}
      onCheckedChange={async (checked) => {
        try {
          await updateMenuItem({
            ...item,
            is_active: checked ? 1 : 0,
          });
          void invalidateMenuQuery();
          toast.success(
            `Platillo ${checked ? "activado" : "desactivado"} exitosamente`,
          );
        } catch (error) {
          console.error("Error updating dish status:", error);
          toast.error("Error al cambiar el estado del platillo");
        }
      }}
    />
  );
};

export const columns: ColumnDef<MenuItem>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => <DishIngredients menuItem={row.original} />,
  },
  {
    accessorKey: "price",
    header: "Precio",
    cell: ({ row }) => `$${row.getValue("price")}`,
  },
  {
    accessorKey: "course_type",
    header: "Tipo",
  },
  {
    accessorKey: "meal_type",
    header: "Comida",
  },
  {
    accessorKey: "is_active",
    header: "Activo",
    cell: ({ row }) => <DishActiveCell row={row} />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex items-center gap-2">
          <ModifyDish item={item} />
          <DeleteDish
            id={item.id!}
            name={item.name}
            restaurant_id={item.restaurant_id}
            location_id={item.location_id}
          />
        </div>
      );
    },
  },
];
