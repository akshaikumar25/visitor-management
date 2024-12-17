"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { ApartmentInfo, Society, User } from "@/types";
import { AppDispatch, RootState } from "@/store";
import {
  fetchAllUser,
  createUser,
  updateUserById,
  deleteUserById,
} from "@/reducers/getAlluser.reducer";
import { DataTable, TableColumn } from "../common/commonTable";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import debounce from "lodash/debounce";
import { fetchAllSocieties } from "@/reducers/society.reducer";
import { fetchAllApartment } from "@/reducers/apartment.reducer";
import UserDialog from "./userForm";

export default function UserDataList() {
  const dispatch = useDispatch<AppDispatch>();
  const [societies, setSocieties] = useState<Society[]>([]);
  const [currentSocietyApartments, setcurrentSocietyApartments] = useState<
    ApartmentInfo[]
  >([]);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const {
    users: users,
    status,
    error,
    pagination,
  } = useSelector((state: RootState) => state.alluser);
  const loginUsers: User | null = useSelector(
    (state: RootState) => state.user.user
  );

  const isAdminOrSuperAdmin =
    loginUsers?.role === "SuperAdmin" ||
    loginUsers?.role === "Admin" ||
    loginUsers?.role === "Manager";

  useEffect(() => {
    if (loginUsers?.role === "Admin" || loginUsers?.role === "Manager") {
      const administrativeSociety = loginUsers?.administrativeSocity ?? [];
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

  const { data: apartments } = useSelector(
    (state: RootState) => state.apartment
  );

  useEffect(() => {
    if (loginUsers?.role === "SuperAdmin") {
      const currentSocietyApartments = apartments || [];
      setcurrentSocietyApartments(currentSocietyApartments);
    } else {
      const currentSocietyApartments =
        apartments?.filter(
          (apartment) => apartment.societyId === loginUsers?.currentSocietyId
        ) || [];
      setcurrentSocietyApartments(currentSocietyApartments);
    }
  }, [loginUsers, apartments]);

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

  useEffect(() => {
    if (!searchTerm) {
      fetchApartment(currentPage, "");
    }
  }, [currentPage, fetchApartment, searchTerm]);

  // Function to filter roles based on the logged-in user's role
  const allRoles = [
    { value: "SuperAdmin", label: "SuperAdmin" },
    { value: "Admin", label: "Admin" },
    { value: "Manager", label: "Manager" },
    { value: "Department", label: "Department" },
    { value: "User", label: "User" },
    { value: "ApartmentTenant", label: "ApartmentTenant" },
    { value: "Security", label: "Security" },
    { value: "Staff", label: "Staff" },
  ];

  const getFilteredRoles = (userRole: string) => {
    switch (userRole) {
      case "SuperAdmin":
        return allRoles;
      case "Admin":
        return allRoles.filter(
          (role) => role.value !== "SuperAdmin" && role.value !== "Admin"
        );
      case "Manager":
        return allRoles.filter(
          (role) =>
            role.value !== "SuperAdmin" &&
            role.value !== "Admin" &&
            role.value !== "Manager"
        );
      default:
        return [];
    }
  };

  // Table columns definition with combined edit and delete actions
  const baseColumns: TableColumn<User>[] = [
    {
      header: "User Name",
      accessor: "name",
    },
    {
      header: "Email",
      accessor: "email",
    },
    {
      header: "Role",
      accessor: "role",
    },
    {
      header: "Phone",
      accessor: "phone",
      render: (value) => value || "N/A",
    },
  ];

  const actionColumn: TableColumn<User> = {
    header: "Actions",
    accessor: "id",
    render: (_, user) => (
      <div className="flex items-center gap-2 justify-start">
        <UserDialog
          mode="edit"
          initialData={user}
          onSave={handleEdit}
          onEdit={handleEdit} // Add this line
          societies={societies}
          apartments={currentSocietyApartments}
          roles={getFilteredRoles(loginUsers?.role ?? "")}
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
          onClick={() => handleDelete(user.id!.toString())}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  };

  const columns = isAdminOrSuperAdmin
    ? [...baseColumns, actionColumn]
    : baseColumns;

  const fetchUser = useCallback(
    async (page: number, search: string) => {
      try {
        await dispatch(
          fetchAllUser({
            page,
            limit: itemsPerPage,
            search: search.trim(),
          })
        );
      } catch (error) {
        toast.error("Failed to load user details");
      }
    },
    [dispatch]
  );

  const debouncedFetch = useCallback(
    debounce((page: number, search: string) => {
      fetchUser(page, search);
    }, 500), // 500ms debounce time
    [fetchUser]
  );

  useEffect(() => {
    if (!searchTerm) {
      fetchUser(currentPage, "");
    }
  }, [currentPage, fetchUser, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    debouncedFetch(1, term);
  };

  const handleAdd = async (user: User) => {
    try {
      const resultAction = await dispatch(createUser(user));
      if (createUser.fulfilled.match(resultAction)) {
        toast.success("User added successfully");
        fetchUser(currentPage, searchTerm);
      } else {
        throw new Error("Failed to create user");
      }
    } catch (error) {
      toast.error("Failed to add user");
    }
  };

  const handleEdit = async (updatedUser: User) => {
    try {
      await dispatch(
        updateUserById({
          id: updatedUser.id,
          data: updatedUser,
        })
      );
      toast.success("User updated successfully");
      fetchUser(currentPage, searchTerm);
    } catch (error) {
      toast.error("Failed to update user");
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      const Id = typeof id === "number" ? String(id) : id;
      await dispatch(deleteUserById(Id));
      toast.success("User deleted successfully");
      fetchUser(currentPage, searchTerm);
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <DataTable
        title="User List"
        searchTitle="Name"
        data={users || []}
        columns={columns}
        searchTerm={searchTerm}
        onSearch={handleSearch}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={status === "loading"}
        addButton={
          isAdminOrSuperAdmin ? (
            <UserDialog
              mode="add"
              onSave={handleAdd}
              onEdit={handleEdit}
              societies={societies}
              apartments={currentSocietyApartments}
              roles={getFilteredRoles(loginUsers?.role ?? "")}
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
