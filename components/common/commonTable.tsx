import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

export interface TableColumn<T> {
  header: string;
  accessor: keyof T;
  render?: (value: any, item: T) => React.ReactNode;
  className?: string;
  width?: string;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

interface DataTableProps<T> {
  title: string;
  searchTitle?: string;
  data: T[];
  columns: TableColumn<T>[];
  searchTerm: string;
  onSearch: (term: string) => void;
  onAdd?: (item: T) => void;
  onEdit?: (item: T) => void;
  onDelete?: (id: string | number) => Promise<void>;
  addButton?: React.ReactNode;
  isLoading?: boolean;
  pagination: PaginationProps;
}

const TableSkeleton = ({
  columns,
  rows = 5,
}: {
  columns: TableColumn<any>[];
  rows: number;
}) => (
  <>
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <TableRow key={rowIndex} className="animate-pulse">
        {columns.map((column, colIndex) => (
          <TableCell
            key={colIndex}
            className={`py-2 ${column.className || ""}`}
            style={{ width: column.width }}
          >
            <div className="h-3 bg-gray-200 rounded w-[80%]" />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);

export function DataTable<T extends { id?: number | string }>({
  title,
  searchTitle,
  data,
  columns,
  searchTerm,
  onSearch,
  addButton,
  isLoading,
  pagination,
}: DataTableProps<T>) {
  const pageNumbers = Array.from(
    { length: pagination.totalPages },
    (_, i) => i + 1
  );
  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage + 1;
  const endIndex = Math.min(
    startIndex + pagination.itemsPerPage - 1,
    pagination.totalItems
  );

  return (
    <div className="space-y-4">
      <Card className="border border-blue-200  rounded-lg  transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-1 bg-blue-900 rounded-full" />
              <CardTitle className="text-lg sm:text-xl font-bold text-blue-900">
                {title}
              </CardTitle>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 transition-colors duration-200" />
                <Input
                  type="text"
                  placeholder={`Search by ${searchTitle?.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => onSearch(e.target.value)}
                  className="pl-9 h-9 w-full sm:w-[280px] text-sm bg-white border-gray-200   rounded-lg  transition-all duration-200"
                />
              </div>
              {addButton && <div className="w-full sm:w-auto">{addButton}</div>}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-lg  border border-blue-200 overflow-hidden  transition-all duration-300">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-white-100 ">
                {columns.map((column) => (
                  <TableHead
                    key={column.header as string}
                    className={`text-blue-900 text-xs sm:text-sm font-semibold h-11 ${
                      column.className || ""
                    }`}
                    style={{ width: column.width }}
                  >
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableSkeleton
                  columns={columns}
                  rows={pagination.itemsPerPage}
                />
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + 1}
                    className="h-32 text-center"
                  >
                    <div className="flex flex-col items-center justify-center text-gray-600">
                      <p className="text-base font-medium">
                        No {title.toLowerCase()} found
                      </p>
                      <p className="text-xs mt-1">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data.map((item) => (
                  <TableRow
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors duration-150 border-b border-gray-200"
                  >
                    {columns.map((column) => (
                      <TableCell
                        key={column.accessor as string}
                        className={`py-2.5 text-xs sm:text-sm text-gray-700 ${
                          column.className || ""
                        }`}
                        style={{ width: column.width }}
                      >
                        {column.render
                          ? column.render(item[column.accessor], item)
                          : (item[column.accessor] as string)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 border-t border-gray-300">
          <div className="text-xs sm:text-sm text-blue-900 mb-3 sm:mb-0">
            <span>Showing </span>
            <span className="font-medium text-blue-900">{startIndex}</span>
            <span>-</span>
            <span className="font-medium text-blue-900">{endIndex}</span>
            <span> of </span>
            <span className="font-medium text-blue-900">
              {pagination.totalItems}
            </span>
            <span> results</span>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Button
              onClick={() =>
                pagination.onPageChange(pagination.currentPage - 1)
              }
              disabled={pagination.currentPage === 1}
              variant="outline"
              size="sm"
              className="h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 hover:text-white border-gray-300 hover:border-yellow-400 hover:bg-yellow-400 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-700 transition-all duration-200"
            >
              Previous
            </Button>

            <div className="flex items-center gap-1.5">
              {pageNumbers.map((pageNumber) => (
                <Button
                  key={pageNumber}
                  onClick={() => pagination.onPageChange(pageNumber)}
                  variant={
                    pagination.currentPage === pageNumber
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  className={`h-8 sm:h-9 min-w-[32px] sm:min-w-[36px] text-xs sm:text-sm font-medium transition-all duration-200 ${
                    pagination.currentPage === pageNumber
                      ? "bg-blue-900 text-white hover:bg-blue-800 "
                      : "text-black border-gray-300 hover:border-yellow-400 hover:bg-gray-50"
                  }`}
                >
                  {pageNumber}
                </Button>
              ))}
            </div>

            <Button
              onClick={() =>
                pagination.onPageChange(pagination.currentPage + 1)
              }
              disabled={pagination.currentPage === pagination.totalPages}
              variant="outline"
              size="sm"
              className="h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700 hover:text-white border-gray-300 hover:border-yellow-400 hover:bg-yellow-400 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-gray-700 transition-all duration-200"
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default DataTable;
