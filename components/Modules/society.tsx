"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import debounce from "lodash/debounce";
import { AppDispatch, RootState } from "@/store";
import {
  getAllSocieties,
  createSociety,
  updateSociety,
  deleteSociety,
} from "@/reducers/society.reducer";
import { DataTable, TableColumn } from "../common/commonTable";
import { FormDialog, FormField } from "../common/commonDialogue";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Society, User as UserData } from "@/types";
import { userfilter } from "@/services/userService";

export default function SocietyManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: societies,
    status,
    error,
    pagination,
  } = useSelector((state: RootState) => state.society);
  const loginUsers: UserData | null = useSelector(
    (state: RootState) => state.user.user
  );
  const isSuperAdmin = loginUsers?.role === "SuperAdmin";
  const {
    data: AdminUsers,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["availableAdmin"],
    queryFn: async () => {
      const data = await userfilter({
        role: "Admin",
      });
      return data.data as UserData[];
    },
    staleTime: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 3;

  // Form fields definition
  const formFields: FormField<Society>[] = [
    {
      name: "name",
      label: "Society Name",
      type: "text",
      placeholder: "Enter society name",
      validation: z.string().min(2, "Name must be at least 2 characters"),
      gridCols: 2,
    },
    {
      name: "admins",
      label: "Admin Names",
      type: "multiselect",
      placeholder: "Select Admins",
      options:
        AdminUsers?.map((user) => ({
          value: user.id,
          label: user.name,
        })) || [],
      validation: z
        .array(z.number())
        .min(1, { message: "At least one admin is required" }),
      gridCols: 2,
    },
    {
      name: "address",
      label: "Address",
      type: "text",
      placeholder: "Enter address",
      validation: z.string().min(5, "Address must be at least 5 characters"),
      gridCols: 2,
    },
    {
      name: "city",
      label: "City",
      type: "text",
      placeholder: "Enter city",
      validation: z.string().min(2, "City must be at least 2 characters"),
    },
    {
      name: "state",
      label: "State",
      type: "text",
      placeholder: "Enter state",
      validation: z.string().min(2, "State must be at least 2 characters"),
    },
    {
      name: "zip",
      label: "ZIP Code",
      type: "text",
      placeholder: "Enter ZIP code",
      validation: z.string().min(5, "ZIP must be at least 5 characters"),
    },
    {
      name: "phone",
      label: "Phone",
      type: "tel",
      placeholder: "Enter phone number",
      validation: z.string().min(10, "Phone must be at least 10 digits"),
    },
  ];

  // Table columns definition
  const baseColumns: TableColumn<Society>[] = [
    {
      header: "Name",
      accessor: "name",
    },
    {
      header: "Admin Names",
      accessor: "admins",
      render: (value, society: Society) => {
        if (!Array.isArray(society.admins)) return "N/A";
        return (
          society.admins
            .map((admin: any) => admin.name)
            .filter(Boolean)
            .join(", ") || "N/A"
        );
      },
    },
    {
      header: "City",
      accessor: "city",
    },
    {
      header: "State",
      accessor: "state",
    },
    {
      header: "Phone",
      accessor: "phone",
      render: (value) => value || "N/A",
    },
  ];

  // Define the Actions column with proper typing
  const actionsColumn: TableColumn<Society> = {
    header: "Actions",
    accessor: "id" as keyof Society,
    render: (_: any, society: Society) => (
      <div className="flex items-center gap-2 justify-start">
        <FormDialog
          mode="edit"
          title="Society"
          fields={formFields}
          data={society}
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
          className="h-8 w-8 text-black hover:text-red-500 hover:bg-red-100 rounded-sm"
          onClick={() => handleDelete(society.id!)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  };

  // Combine columns based on user role with proper typing
  const columns: TableColumn<Society>[] = isSuperAdmin
    ? [...baseColumns, actionsColumn]
    : baseColumns;

  const fetchSocieties = useCallback(
    async (page: number, search: string) => {
      try {
        const resultAction = await dispatch(
          getAllSocieties({
            page,
            limit: itemsPerPage,
            search: search.trim(),
          })
        );
        if (getAllSocieties.rejected.match(resultAction)) {
          toast.error("Failed to load societies");
        }
      } catch (error) {
        toast.error("Failed to load societies");
      }
    },
    [dispatch]
  );

  const debouncedFetch = useCallback(
    debounce((page: number, search: string) => {
      fetchSocieties(page, search);
    }, 500),
    [fetchSocieties]
  );

  useEffect(() => {
    if (!searchTerm) {
      fetchSocieties(currentPage, "");
    }
  }, [currentPage, fetchSocieties, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    debouncedFetch(1, term);
  };

  const formatSocietyData = (society: Society) => {
    const safeSociety = {
      name: society.name || "",
      phone: society.phone || "",
      admins: Array.isArray(society.admins) ? society.admins : [],
      address: society.address || "",
      city: society.city || "",
      state: society.state || "",
      zip: society.zip || "",
    };

    return safeSociety;
  };

  const handleAdd = async (society: Omit<Society, "id">) => {
    try {
      const formattedGuest = formatSocietyData(society);
      const resultAction = await dispatch(createSociety(formattedGuest));
      if (resultAction.payload.success) {
        toast.success("Society added successfully");
        const newPage = 1;
        setCurrentPage(newPage);
        fetchSocieties(newPage, searchTerm);
      } else {
        toast.error(resultAction.payload.message);
      }
    } catch (error) {
      toast.error("Failed to add society");
    }
  };

  const handleEdit = async (updatedSociety: Society) => {
    try {
      const formattedGuest = formatSocietyData(updatedSociety);
      const resultAction = await dispatch(
        updateSociety({
          id: updatedSociety.id!.toString(),
          data: formattedGuest,
        })
      );
      if (resultAction.payload.data.success) {
        toast.success("Society updated successfully");
        fetchSocieties(currentPage, searchTerm);
      }
    } catch (error) {
      toast.error("Failed to update society");
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      const resultAction = await dispatch(deleteSociety(id.toString()));
      if (resultAction.payload.success) {
        toast.success("Society deleted successfully");
        if (societies && societies.length === 1 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        } else {
          fetchSocieties(currentPage, searchTerm);
        }
      }
    } catch (error) {
      toast.error("Failed to delete society");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <DataTable
        title="Societies"
        searchTitle="Name"
        data={societies || []}
        columns={columns}
        searchTerm={searchTerm}
        onSearch={handleSearch}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={status === "loading"}
        addButton={
          isSuperAdmin ? (
            <FormDialog
              mode="add"
              title="Society"
              fields={formFields}
              onSave={handleAdd}
            />
          ) : undefined
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