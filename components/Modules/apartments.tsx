"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { toast } from "sonner";
import { ApartmentInfo, User, Society } from "@/types";
import { AppDispatch, RootState } from "@/store";
import {
  fetchAllApartment,
  createApartment,
  updateApartmentById,
  deleteApartmentById,
} from "@/reducers/apartment.reducer";
import { DataTable, TableColumn } from "../common/commonTable";
import { FormDialog, FormField } from "../common/commonDialogue";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import debounce from "lodash/debounce";
import { useQuery } from "@tanstack/react-query";
import { fetchAllSocieties } from "@/reducers/society.reducer";
import { userfilter } from "@/services/userService";

export default function Apartment() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: apartment,
    status,
    error,
    pagination,
  } = useSelector((state: RootState) => state.apartment);
  const [filtersocieties, setSocieties] = useState<Society[]>([]);
  const loginUsers: User | null = useSelector(
    (state: RootState) => state.user.user
  );

  const isAdminOrSuperAdmin =
    loginUsers?.role === "SuperAdmin" ||
    loginUsers?.role === "Admin" ||
    loginUsers?.role === "Manager";

  const {
    data: AdminUsers,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["availableDepartment"],
    queryFn: async () => {
      const data = await userfilter({
        role: "Department",
        currentSocietyId: loginUsers?.currentSocietyId,
        apartment: {},
      });
      return data.data as User[];
    },
    staleTime: 0,
  });

  useEffect(() => {
    if (loginUsers?.role === "Admin" || loginUsers?.role === "Manager") {
      const administrativeSociety = loginUsers?.administrativeSocity || [];

      const filteredSocieties = administrativeSociety.filter(
        (society) => society.id === loginUsers?.currentSocietyId
      );
      setSocieties(filteredSocieties);
    } else {
      fetchSocieties();
    }
  }, [loginUsers]);

  const fetchSocieties = useCallback(async () => {
    try {
      const Socities = await dispatch(fetchAllSocieties());
      setSocieties(Socities.payload);
    } catch (error) {
      toast.error("Failed to load Socities details");
    }
  }, [dispatch]);

  const formFields: FormField<ApartmentInfo>[] = [
    {
      name: "name",
      label: "Department*",
      type: "text",
      placeholder: "Enter Department",
      validation: z
        .string()
        .min(1, { message: "Department is required" })
        .regex(/^[0-9A-Za-z-]+$/, {
          message: "Only numbers, letters, and hyphens are allowed",
        }),
      gridCols: 1,
    },
    {
      name: "societyId",
      label: "Society Name*",
      type: "select",
      placeholder: "Select Society",
      options:
        filtersocieties?.map((society: Society) => ({
          value: society.id as number,
          label: society.name as string,
        })) || [],
      validation: z.string().min(1, { message: "Society is required" }),
      gridCols: 1,
      defaultValue:
        loginUsers?.role === "SuperAdmin"
          ? null
          : loginUsers?.currentSocietyId?.toString(),
    },
    {
      name: "userId",
      label: "User Name*",
      type: "select",
      placeholder: "Select User",
      options:
        AdminUsers?.map((user) => ({
          value: user.id,
          label: user.name,
        })) || [],
      validation: z.string().min(1, { message: "User is required" }),
      gridCols: 1,
    },
  ];

  // Define base columns without actions
  const baseColumns: TableColumn<ApartmentInfo>[] = [
    {
      header: "Department",
      accessor: "name",
    },
    {
      header: "Society Name",
      accessor: "society",
    },
    {
      header: "User",
      accessor: "users",
    },
  ];

  // Define action column
  const actionColumn: TableColumn<ApartmentInfo> = {
    header: "Actions",
    accessor: "id",
    render: (_, apartment) => (
      <div className="flex items-center gap-2 justify-start">
        <FormDialog
          mode="edit"
          title="Department"
          fields={formFields}
          data={apartment}
          onSave={handleEdit}
          trigger={
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-black hover:text-blue-700 hover:bg-blue-100"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          }
        />
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 text-black hover:text-red-500  hover:bg-red-100 rounded-sm"
          onClick={() => handleDelete(apartment.id!.toString())}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  };

  // Conditionally add action column based on user role
  const columns = isAdminOrSuperAdmin
    ? [...baseColumns, actionColumn]
    : baseColumns;

  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchApartment = useCallback(
    async (page: number, search: string) => {
      try {
        await dispatch(
          fetchAllApartment({
            page,
            limit: itemsPerPage,
            search: search.trim(),
          })
        );
      } catch (error) {
        toast.error("Failed to load apartment details");
      }
    },
    [dispatch]
  );

  const debouncedFetch = useCallback(
    debounce((page: number, search: string) => {
      fetchApartment(page, search);
    }, 500),
    [fetchApartment]
  );

  useEffect(() => {
    if (!searchTerm) {
      fetchApartment(currentPage, "");
    }
  }, [currentPage, fetchApartment, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    debouncedFetch(1, term);
  };

  const handleAdd = async (apartment: ApartmentInfo) => {
    try {
      const resultAction = await dispatch(createApartment(apartment));
      if (createApartment.fulfilled.match(resultAction)) {
        toast.success("Department added successfully");
        fetchApartment(currentPage, searchTerm);
      } else {
        throw new Error("Failed to create Department");
      }
    } catch (error) {
      toast.error("Failed to add Department");
    }
  };

  const handleEdit = async (updatedApartment: ApartmentInfo) => {
    try {
      const resultAction = await dispatch(
        updateApartmentById({
          id: String(updatedApartment.id),
          data: updatedApartment,
        })
      );
      fetchApartment(currentPage, searchTerm);
      toast.success("Department updated successfully");
    } catch (error) {
      toast.error("Failed to update Department");
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      const apartmentId = typeof id === "number" ? String(id) : id;
      const resultAction = await dispatch(deleteApartmentById(apartmentId));
      if (apartment && apartment.length === 1 && currentPage > 1) {
        toast.success("Department deleted successfully");
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchApartment(currentPage, searchTerm);
      }
    } catch (error) {
      toast.error("Failed to delete Department");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <DataTable
        title="Department List"
        searchTitle="Name"
        data={apartment || []}
        columns={columns}
        searchTerm={searchTerm}
        onSearch={handleSearch}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={status === "loading"}
        addButton={
          isAdminOrSuperAdmin ? (
            <FormDialog
              mode="add"
              title="Department"
              fields={formFields}
              onSave={handleAdd}
            />
          ) : null
        }
        pagination={{
          currentPage: currentPage,
          totalPages: pagination?.totalPages || 1,
          totalItems: pagination?.total || 0,
          itemsPerPage: pagination?.limit || itemsPerPage,
          onPageChange: handlePageChange,
        }}
      />
    </div>
  );
}
