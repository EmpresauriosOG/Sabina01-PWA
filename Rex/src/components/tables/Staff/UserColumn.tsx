/* eslint-disable react-refresh/only-export-components */
import { ColumnDef, Row } from "@tanstack/react-table";
import { Staff } from "../../Staff/constants";
import { DataTableColumnHeader } from "../ColumnHeader";
import DeleteToast from "../DeleteToast";
import ModifyButton from "../Ingredients/ModifyButton";
import { deleteStaff } from "@/utils/staffUtils";
import { useQueryClient } from "@tanstack/react-query";

const StaffActionsCell = ({ row }: { row: Row<Staff> }) => {
  const queryClient = useQueryClient();
  const data = row.original;

  const invalidateStaffQuery = async () => {
    if (data.restaurant_id && data.location_id) {
      await queryClient.invalidateQueries({
        queryKey: ["staff", data.restaurant_id, data.location_id],
      });
      return;
    }

    await queryClient.invalidateQueries({ queryKey: ["staff"] });
  };

  return (
    <div className="flex items-center space-x-2">
      <DeleteToast
        item={row.getValue("email")}
        onDelete={async (email) => {
          await deleteStaff(email);
          void invalidateStaffQuery();
        }}
      />
      <ModifyButton
        dialogTitle="Modificar Personal"
        dialogDescription="Ingresa"
        item={{ ...data, itemName: "staff" } as Staff}
      />
    </div>
  );
};

export const columns: ColumnDef<Staff>[] = [
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="email" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "first_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="nombre" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("first_name")}</div>
    ),
  },
  {
    accessorKey: "last_name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Apellido" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("last_name")}</div>
    ),
  },
  {
    accessorKey: "roles",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Roles" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("roles")}</div>
    ),
  },
  {
    accessorKey: "Opciones",
    cell: ({ row }) => <StaffActionsCell row={row} />,
  },
];
