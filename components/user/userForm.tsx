import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Society, ApartmentInfo } from "@/types";
import { Plus } from "lucide-react";

const userSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .regex(/^[A-Za-z]+$/, { message: "Name must contain only alphabets" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .regex(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, {
      message: "Invalid email format",
    }),
  role: z.string().min(1, { message: "Role is required" }),
  currentSocietyId: z.string().optional(),
  apartmentId: z.string().optional(),
  phone: z
    .string()
    .min(1, { message: "Phone number is required" })
    .min(10, { message: "Phone number must be at least 10 digits" })
    .max(10, { message: "Phone number must be at most 10 digits" })
    .regex(/^\d+$/, { message: "Phone number must contain only digits" }),
});

interface UserDialogProps {
  mode: "add" | "edit";
  onSave: (data: User) => void;
  onEdit: (data: User) => void;
  initialData?: User;
  societies: Society[];
  apartments: ApartmentInfo[];
  roles: { value: string; label: string }[];
  trigger?: React.ReactNode;
}

export default function UserDialog({
  mode,
  onSave,
  onEdit,
  initialData,
  societies,
  apartments,
  roles,
  trigger,
}: UserDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [role, setRole] = useState("");
  const [society, setSociety] = useState("");
  const [apartment, setApartment] = useState("");

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      currentSocietyId: "",
      apartmentId: "",
      phone: "",
    },
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData) {
        // For edit mode, set all the fields with initial data
        form.reset({
          name: initialData.name || "",
          email: initialData.email || "",
          role: initialData.role || "",
          currentSocietyId: initialData.currentSocietyId?.toString() || "",
          apartmentId: initialData.apartmentId?.toString() || "",
          phone: initialData.phone || "",
        });
        setRole(initialData.role);
        setSociety(initialData.currentSocietyId?.toString() || "");
        setApartment(initialData.apartmentId?.toString() || "");
      } else {
        // For add mode, reset to empty values
        form.reset({
          name: "",
          email: "",
          role: "",
          currentSocietyId: society || "",
          apartmentId: apartment || "",
          phone: "",
        });
      }
    }
  }, [open, initialData, mode, form]);

  const onSubmit = async (data: any) => {
    try {
      const formattedData = {
        ...data,
        id: initialData?.id,
        currentSocietyId: data.currentSocietyId
          ? parseInt(data.currentSocietyId)
          : undefined,
        apartmentId: data.apartmentId ? parseInt(data.apartmentId) : undefined,
      };
      if (mode === "edit") {
        await onEdit(formattedData);
      } else {
        await onSave(formattedData);
      }

      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2 bg-blue-900 text-white hover:bg-blue-800">
            <Plus className="h-4 w-4 text-white" />
            Add User
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-blue-900 flex gap-2">
            <div className="h-5 w-1 bg-blue-900 rounded-full" />
            {mode === "add" ? "Add New User" : "Edit User"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">User Name*</Label>
              <Input
                id="name"
                placeholder="Enter user name"
                {...form.register("name")}
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email*</Label>
              <Input
                id="email"
                placeholder="Enter Email"
                {...form.register("email")}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role*</Label>
              <Select
                onValueChange={(value) => {
                  form.setValue("role", value);
                  setRole(value);
                }}
                value={role}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {form.formState.errors.role && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.role.message}
                </p>
              )}
            </div>
            {role !== "Admin" && role !== "SuperAdmin" && (
              <div className="space-y-2">
                <Label htmlFor="currentSocietyId">Society Name</Label>
                <Select
                  onValueChange={(value) => {
                    form.setValue("currentSocietyId", value);
                    setSociety(value);
                  }}
                  value={society}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Society" />
                  </SelectTrigger>
                  <SelectContent>
                    {societies.map((society) => (
                      <SelectItem
                        key={society.id}
                        value={society.id?.toString() || ""}
                      >
                        {society.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {(role === "User" || role === "ApartmentTenant") && (
              <div className="space-y-2">
                <Label htmlFor="apartmentId">Department No</Label>
                <Select
                  onValueChange={(value: string) => {
                    form.setValue("apartmentId", value);
                    setApartment(value);
                  }}
                  value={apartment}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department" />
                  </SelectTrigger>
                  <SelectContent>
                    {apartments.map((apartment) => (
                      <SelectItem
                        key={apartment.id}
                        value={apartment.id?.toString() || ""}
                      >
                        {apartment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="phone">Phone*</Label>
              <Input
                id="phone"
                placeholder="Enter phone number"
                {...form.register("phone")}
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="submit"
              className="bg-blue-900 text-white hover:bg-blue-900"
            >
              {mode === "add" ? "Add User" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
