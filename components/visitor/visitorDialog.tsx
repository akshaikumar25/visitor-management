"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { visitorSchema } from "./visitorvalidation";
import { ApartmentInfo, VisitorInfo, User } from "@/types";
import VisitorForm from "./visitorForm";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

interface VisitorDialogProps {
  mode: "edit" | "add";
  initialData: VisitorInfo | null;
  onSave: (visitor: VisitorInfo) => Promise<void>;
  onEdit: (visitor: VisitorInfo) => Promise<void>;
  apartments: ApartmentInfo[];
  trigger?: React.JSX.Element | null;
  loginUser: User | null;
}

export default function VisitorDialog({
  mode = "add",
  onSave,
  onEdit,
  apartments,
  initialData,
  trigger,
  loginUser,
}: VisitorDialogProps) {
  const [open, setOpen] = useState(false);
  const [image, setVisitorImage] = useState<File | null>(null);
  const [idproof, setidproofFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<z.infer<typeof visitorSchema>>({
    resolver: zodResolver(visitorSchema),
    defaultValues: {
      name: "",
      phone: "",
      address: "",
      purpose: "",
      visitorscount: 1,
      apartmentId: "",
      travelmode: "",
      vehicleNo: "",
      createdbyrole: "",
      createdby: "",
    },
  });

  useEffect(() => {
    if (open) {
      if (mode === "edit" && initialData !== null) {
        reset({
          name: initialData.name ?? "",
          phone: initialData.phone ?? "",
          address: initialData.address ?? "",
          image: initialData.image ?? "",
          idproof: initialData.idproof ?? "",
          visitorscount: initialData.visitorscount ?? 1,
          apartmentId:
            initialData.apartmentId != null
              ? String(initialData.apartmentId)
              : "",
          fromdate:
            initialData.fromdate != null
              ? new Date(initialData.fromdate).toISOString().slice(0, 16)
              : "",
          todate:
            initialData.todate != null
              ? new Date(initialData.todate).toISOString().slice(0, 16)
              : "",
          travelmode: initialData.travelmode ?? "",
          purpose: initialData.purpose ?? "",
          vehicleNo: initialData.vehicleNo ?? "",
          visitorstatus: initialData.visitorstatus ?? "",
          approvalstatus:
            initialData.approvalstatus != null
              ? initialData.approvalstatus
              : "",
          arrivedtime:
            initialData.arrivedtime != null
              ? new Date(initialData.arrivedtime).toISOString().slice(0, 16)
              : "",
          departedtime:
            initialData.departedtime != null
              ? new Date(initialData.departedtime).toISOString().slice(0, 16)
              : "",
        });
      } else {
        reset({
          name: "",
          phone: "",
          address: "",
          purpose: "",
          visitorscount: 1,
          apartmentId: "",
          fromdate: "",
          todate: "",
          travelmode: "",
          vehicleNo: "",
          createdby: "",
        });
      }
    }
  }, [open, initialData, mode, reset]);

  const formSubmit = async (data: any) => {
    const formData: any = {
      ...data,
    };
    if (image) {
      formData.image = image;
    }

    if (idproof) {
      formData.idproof = idproof;
    }

    try {
      if (mode === "add") {
        await onSave(formData);
      } else if (mode === "edit") {
        if (initialData?.id) {
          formData.id = initialData?.id;
        }
        await onEdit(formData);
      }
      setOpen(false);
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      if (type === "image") {
        setVisitorImage(file);
      } else if (type === "idproof") {
        setidproofFile(file);
      }
    }
  };

  const removeFile = (type: string) => {
    if (type === "image") {
      setVisitorImage(null);
    } else if (type === "idproof") {
      setidproofFile(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2  text-white bg-blue-900 hover:bg-blue-800 ">
            <Plus className="h-4 w-4 text-white " />
            Add Visitor
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-blue-900 flex gap-2">
            <div className="h-5 w-1 bg-blue-900 rounded-full" />
            {mode === "add" ? "Add New Visitor" : "Edit Visitor"}
          </DialogTitle>
        </DialogHeader>
        <VisitorForm
          mode={mode}
          register={register}
          control={control}
          errors={errors}
          apartments={apartments}
          handleSubmit={handleSubmit}
          formSubmit={formSubmit}
          loginUser={loginUser}
          image={image}
          idproof={idproof}
          handleImageUpload={handleImageUpload}
          removeFile={removeFile}
          initialData={initialData}
          watch={watch}
        />
      </DialogContent>
    </Dialog>
  );
}
