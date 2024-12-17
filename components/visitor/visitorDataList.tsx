"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { toast } from "sonner";
import debounce from "lodash/debounce";
import { AppDispatch, RootState } from "@/store";
import {
  getAllVisitor,
  createVisitor,
  updateVisitor,
  deleteVisitor,
} from "@/reducers/visitor.reducer";
import { fetchAllApartment } from "@/reducers/apartment.reducer";
import { DataTable, TableColumn } from "../common/commonTable";
import { VisitorInfo, User, Society, ApartmentInfo } from "@/types";
import { Pencil, Trash2 } from "lucide-react";
import { getAllSocietiesById } from "@/services/societyService";
import VisitorDialoge from "./visitorDialog";
import { Button } from "../ui/button";

export default function VisitorManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const loginUser: User | null = useSelector(
    (state: RootState) => state.user.user
  );
  const {
    data: visitor,
    status,
    error,
    pagination,
  } = useSelector((state: RootState) => state.visitor);

  const { data: apartments } = useSelector(
    (state: RootState) => state.apartment
  );

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [societyApartments, setSocietyApartments] = useState<ApartmentInfo[]>(
    []
  );
  const itemsPerPage = 10;

  const fetchApartmentsBySociety = async (societyId: number) => {
    try {
      const response = await getAllSocietiesById(societyId);
      if (response.success) {
        const society: Society = response.data;
        setSocietyApartments(society.Apartment || []);
      } else {
        toast.error("Failed to fetch society apartments");
      }
    } catch (error) {
      toast.error("Error fetching society apartments");
    }
  };

  useEffect(() => {
    const fetchApartments = async () => {
      if (loginUser) {
        if (loginUser.role === "SuperAdmin") {
          dispatch(fetchAllApartment({}));
        } else if (
          ["Admin", "Manager", "Security"].includes(loginUser.role) &&
          loginUser.currentSocietyId
        ) {
          await fetchApartmentsBySociety(loginUser.currentSocietyId);
        } else if (loginUser.role === "Department" && loginUser.apartment) {
          setSocietyApartments(loginUser.apartment);
        }
      }
    };
    fetchApartments();
  }, [dispatch, loginUser]);

  const columns: TableColumn<VisitorInfo>[] = [
    {
      header: "Visitor Name",
      accessor: "name",
      className: "font-medium",
    },
    {
      header: "Department/Office",
      accessor: "apartmentId",
      className: "font-medium",
      render: (value) => {
        const apartmentsToUse =
          loginUser?.role === "SuperAdmin"
            ? apartments
            : loginUser?.role === "Department"
            ? loginUser.apartment
            : loginUser?.role === "Security"
            ? societyApartments
            : societyApartments;

        const apartment = apartmentsToUse?.find(
          (apt) => apt?.id?.toString() === value?.toString()
        );
        return apartment?.name ?? value ?? "N/A";
      },
    },

    {
      header: "Date",
      accessor: "fromdate",
      className: "font-medium",
      render: (_, visitor) => {
        const date = new Date(visitor.fromdate);
        const formattedDate = date.toLocaleDateString();
        return <span>{formattedDate}</span>;
      },
    },
    {
      header: "Visitors Count",
      accessor: "visitorscount",
      className: "font-medium text-center",
    },
    {
      header: "Travel Mode",
      accessor: "travelmode",
      className: "font-medium",
    },
    {
      header: "Created By",
      accessor: "createdby",
      className: "font-medium",
    },
    {
      header: "Approval Status",
      accessor: "approvalstatus",
      className: "font-small",
      render: (_, visitor) => {
        let statusText;
        let textColor;

        if (visitor?.approvalstatus === "Approved") {
          statusText = "Approved";
          textColor = "text-green-500";
        } else if (visitor?.approvalstatus === "Denied") {
          statusText = "Denied";
          textColor = "text-red-600";
        } else {
          statusText = "Pending";
          textColor = "text-yellow-500";
        }

        return (
          <span
            className={`inline-block px-3 py-1 rounded-md ${textColor} text-xs`}
          >
            {statusText}
          </span>
        );
      },
    },
    {
      header: "Visitor Status",
      accessor: "visitorstatus",
      className: "font-small",
      render: (_, visitor) => {
        let statusText = "";
        let textColorClass = "";

        switch (visitor.visitorstatus) {
          case "Arrived":
            statusText = "Arrived";
            textColorClass = "text-blue-900";
            break;
          case "Departed":
            statusText = "Departed";
            textColorClass = "text-yellow-500";
            break;
          case "Scheduled":
            statusText = "Scheduled";
            textColorClass = "text-gray-500";
            break;
          case "Canceled":
            statusText = "Canceled";
            textColorClass = "text-red-600";
            break;
          default:
            statusText = "Unknown";
            textColorClass = "text-gray-400";
        }

        return (
          <span
            className={`inline-block px-3 py-1 rounded-md ${textColorClass} text-xs`}
          >
            {statusText}
          </span>
        );
      },
    },
    {
      header: "Actions",
      accessor: "id",
      render: (_, visitor) => (
        <div className="flex items-center gap-2 justify-start">
          <VisitorDialoge
            mode="edit"
            initialData={visitor}
            onSave={handleEdit}
            onEdit={handleEdit}
            apartments={societyApartments}
            loginUser={loginUser}
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
            onClick={() => handleDelete(visitor.id!.toString())}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  const fetchVisitors = useCallback(
    async (page: number, search: string) => {
      try {
        const resultAction = await dispatch(
          getAllVisitor({
            page,
            limit: itemsPerPage,
            search: search.trim(),
          })
        );
        if (getAllVisitor.rejected.match(resultAction)) {
          toast.error("Failed to load s");
        }
      } catch (error) {
        toast.error("Failed to load visitors");
      }
    },
    [dispatch]
  );

  const debouncedFetch = useCallback(
    debounce((page: number, search: string) => {
      fetchVisitors(page, search);
    }, 500),
    [fetchVisitors]
  );

  useEffect(() => {
    if (!searchTerm) {
      fetchVisitors(currentPage, "");
    }
  }, [currentPage, fetchVisitors, searchTerm]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
    debouncedFetch(1, term);
  };

  const handleAdd = async (visitor: VisitorInfo) => {
    try {
      const formattedVisitor: VisitorInfo = {
        ...visitor,
        createdby: loginUser?.name,
        createdbyrole: loginUser?.role,
      };
      const resultAction = await dispatch(createVisitor(formattedVisitor));
      if (resultAction.payload) {
        toast.success("Visitor added successfully");
        const newPage = 1;
        setCurrentPage(newPage);
        fetchVisitors(newPage, searchTerm);
      } else {
        toast.error(resultAction.payload.message);
      }
    } catch (error) {
      toast.error("Failed to add Visitor");
    }
  };

  const handleEdit = async (visitor: VisitorInfo) => {
    try {
      const formattedVisitor: VisitorInfo = {
        ...visitor,
        createdby: loginUser?.name,
        createdbyrole: loginUser?.role,
      };

      const resultAction = await dispatch(
        updateVisitor({
          id: visitor.id!.toString(),
          data: formattedVisitor,
        })
      );

      if (resultAction.payload.success) {
        toast.success("Visitor updated successfully");
        fetchVisitors(currentPage, searchTerm);
      } else {
        toast.error(resultAction.payload.message);
      }
    } catch (error) {
      toast.error("Failed to update Visitor");
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      const resultAction = await dispatch(deleteVisitor(id.toString()));
      if (resultAction.payload.success) {
        toast.success("Visitor deleted successfully");
        if (visitor && visitor.length === 1 && currentPage > 1) {
          setCurrentPage((prev) => prev - 1);
        } else {
          fetchVisitors(currentPage, searchTerm);
        }
      } else {
        toast.error(resultAction.payload.message);
      }
    } catch (error) {
      toast.error("Failed to delete visitors");
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    fetchVisitors(currentPage, searchTerm);
  }, [currentPage, fetchVisitors, searchTerm]);

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <DataTable
        title="Visitor Management"
        searchTitle="Name"
        data={visitor || []}
        columns={columns}
        searchTerm={searchTerm}
        onSearch={handleSearch}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={status === "loading"}
        addButton={
          <VisitorDialoge
            mode="add"
            onSave={handleAdd}
            onEdit={handleEdit}
            apartments={societyApartments}
            loginUser={loginUser}
            initialData={null}
            trigger={null}
          />
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
