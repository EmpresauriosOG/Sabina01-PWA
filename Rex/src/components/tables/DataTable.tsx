import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  Row,
  FilterFn,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Input } from "@/components/ui/input";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  filter: string | string[];
  Modal: JSX.Element;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filter,
  Modal,
}: DataTableProps<TData, TValue>) {
  //state
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [searchValue, setSearchValue] = React.useState<string>("");
  const [globalFilter, setGlobalFilter] = React.useState<string>("");
  
  // Custom filter function that searches across multiple columns
  const multiColumnFilter: FilterFn<TData> = React.useCallback(
    (row: Row<TData>, _columnId: string, filterValue: string) => {
      if (!filterValue) return true;

      const filterFields = Array.isArray(filter) ? filter : [filter];
      const filterValueLower = filterValue.toLowerCase();

      return filterFields.some((field) => {
        const cellValue = String(row.getValue(field) || "").toLowerCase();
        return cellValue.includes(filterValueLower);
      });
    },
    [filter],
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: multiColumnFilter,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  // Handle search 
  const handleSearch = (value: string) => {
    setSearchValue(value);
    setGlobalFilter(value);
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <div className="flex justify-between py-4 px-4 sm:px-6 lg:px-8">
        <Input
          placeholder="Buscar"
          value={searchValue}
          onChange={(event) => handleSearch(event.target.value)}
          className="max-w-sm"
        />
        {Modal}
      </div>
      <Table className="min-w-full">
        {/* //Table Header */}
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        {/* //Table Body */}
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {/* //Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4 px-4 sm:px-6 lg:px-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Antes
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Despues
        </Button>
      </div>
    </div>
  );
}
