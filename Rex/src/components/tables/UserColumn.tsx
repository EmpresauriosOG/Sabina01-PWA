import { ColumnDef } from "@tanstack/react-table";
import { Staff } from "../Staff/constants";
import { DataTableColumnHeader } from "./ColumnHeader";
import DeleteToast from "./DeleteToast";

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
    cell: ({ row }) => {
      return <DeleteToast item={row.getValue("email")} />;
    },
  },
];
