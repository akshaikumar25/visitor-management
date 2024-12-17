"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AlertTriangle, Clock, Car, Shield, X, User2Icon } from "lucide-react";
import Image from "next/image";
import { ApartmentInfo, VisitorInfo, User } from "@/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VisitorFormProps {
  mode: "edit" | "add";
  register: any;
  control: any;
  errors: any;
  apartments: ApartmentInfo[];
  handleSubmit: any;
  formSubmit: (data: any) => Promise<void>;
  loginUser: User | null;
  image: File | null;
  idproof: File | null;
  handleImageUpload: (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => void;
  removeFile: (type: string) => void;
  initialData: VisitorInfo | null;
  watch: any;
}

export default function VisitorForm({
  mode,
  register,
  control,
  errors,
  apartments,
  handleSubmit,
  formSubmit,
  loginUser,
  image,
  idproof,
  handleImageUpload,
  removeFile,
  initialData,
  watch,
}: VisitorFormProps) {
  const [activeTab, setActiveTab] = useState("basicInfo");
  const [travelMode, setTravelMode] = useState("");
  const fromdate = watch("fromdate");
  const todate = watch("todate");

  const tabOrder =
    mode !== "edit"
      ? ["basicInfo", "visitDetails", "vehicleInfo"]
      : ["basicInfo", "visitDetails", "vehicleInfo", "status"];

  const handleNext = () => {
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex < tabOrder.length - 1) {
      setActiveTab(tabOrder[currentIndex + 1]);
    }
  };

  const handlePrevious = () => {
    const currentIndex = tabOrder.indexOf(activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabOrder[currentIndex - 1]);
    }
  };

  return (
    <form onSubmit={handleSubmit(formSubmit)}>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue="basicInfo"
        className="w-full"
      >
        <TabsList className="flex mb-6">
          <TabsTrigger value="basicInfo">
            <User2Icon className="mr-2 h-4 w-4" />
            <span className="text-xs">Basic info</span>
          </TabsTrigger>
          <TabsTrigger value="visitDetails">
            <Clock className="mr-2 h-4 w-4" />
            <span className="text-xs"> Visit Details</span>
          </TabsTrigger>
          <TabsTrigger value="vehicleInfo">
            <Car className="mr-2 h-4 w-4" />
            <span className="text-xs"> Vehicle </span>
          </TabsTrigger>

          {(loginUser?.role === "Department" ||
            loginUser?.role === "Security") &&
            mode === "edit" && (
              <TabsTrigger value="status">
                <Shield className="mr-2 h-4 w-4" />
                <span className="text-xs"> Status </span>
              </TabsTrigger>
            )}
        </TabsList>

        {/* Basic Information Tab */}
        <TabsContent value="basicInfo" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Visitor Name <span className="text-red-600">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Enter visitor name"
              {...register("name", { required: "Name is required" })}
            />
            {errors.name && (
              <p className="text-sm text-red-600 flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4" />
                {errors.name.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">
              Phone Number<span className="text-red-600">*</span>
            </Label>
            <Input
              id="phone"
              placeholder="Enter phone number"
              {...register("phone", { required: "Phone is required" })}
            />
            {errors.phone && (
              <p className="text-sm text-red-600 flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4" />
                {errors.phone.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">
              Address <span className="text-red-600">*</span>
            </Label>
            <textarea
              id="address"
              placeholder="Enter full address"
              {...register("address", {
                required: "Address is required",
              })}
              className="w-full rounded-md border border-gray-300 p-2 min-h-[100px]"
            />
            {errors.address && (
              <p className="text-sm text-red-600 flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4" />
                {errors.address.message}
              </p>
            )}
          </div>
          {loginUser?.role === "Security" && (
            <>
              <div className="space-y-2">
                <Label>Visitor Image</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="file"
                    accept="image/*"
                    className="cursor-pointer"
                    onChange={(e) => handleImageUpload(e, "image")}
                  />
                  {image ? (
                    <div className="flex items-center space-x-2">
                      <Image
                        src={URL.createObjectURL(image)}
                        alt="Visitor Preview"
                        className="h-10 w-10 rounded-full"
                        width={40}
                        height={40}
                      />
                      <button type="button" onClick={() => removeFile("image")}>
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <Image
                      src={initialData?.image || "/userimg.jpeg"}
                      alt="Visitor Preview"
                      className="h-10 w-10 rounded-full"
                      width={40}
                      height={40}
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Visitor ID Proof</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="file"
                    accept="image/*"
                    className="cursor-pointer"
                    onChange={(e) => handleImageUpload(e, "idproof")}
                  />
                  {idproof ? (
                    <div className="flex items-center space-x-2">
                      <Image
                        src={URL.createObjectURL(idproof)}
                        alt="ID Proof Preview"
                        className="h-10 w-10 rounded-full"
                        width={40}
                        height={40}
                      />
                      <button
                        type="button"
                        onClick={() => removeFile("idproof")}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : (
                    <Image
                      src={initialData?.idproof || "/idproofimg.png"}
                      alt="ID Proof Preview"
                      className="h-10 w-10 rounded-full"
                      width={40}
                      height={40}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </TabsContent>

        {/* Visit Details Tab */}
        <TabsContent value="visitDetails" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="visitorscount">
              Number of Visitors<span className="text-red-600">*</span>
            </Label>
            <Input
              id="visitorscount"
              type="number"
              placeholder="Enter number of visitors"
              {...register("visitorscount", {
                required: "Visitors count is required",
                valueAsNumber: true,
              })}
            />
            {errors.visitorscount && (
              <p className="text-sm text-red-600 flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4" />
                {errors.visitorscount.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="apartmentId">
              Department/Office<span className="text-red-600">*</span>
            </Label>
            <Controller
              name="apartmentId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Department/Office" />
                  </SelectTrigger>
                  <SelectContent>
                    {apartments.map((apartment: ApartmentInfo) => (
                      <SelectItem
                        key={apartment.id}
                        value={String(apartment.id)}
                      >
                        {apartment.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.apartmentId && (
              <p className="text-sm text-red-600 flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4" />
                {errors.apartmentId.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose of Visit</Label>
            <textarea
              id="purpose"
              placeholder="Enter full Purpose of Visit"
              {...register("purpose")}
              className="w-full rounded-md border border-gray-300 p-2 min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fromdate">
              From Date<span className="text-red-600">*</span>
            </Label>
            <Input
              type="datetime-local"
              id="fromdate"
              {...register("fromdate", {
                required: "From date is required",
              })}
            />
            {errors.fromdate && (
              <p className="text-sm text-red-600 flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4" />
                {errors.fromdate.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="todate">
              To Date<span className="text-red-600">*</span>
            </Label>
            <Input
              type="datetime-local"
              id="todate"
              {...register("todate", {
                required: "To date is required",
                validate: (todate: any) => {
                  if (fromdate && todate < fromdate) {
                    console.log(todate);
                    return "To date must be equal to or later than from date";
                  }
                  return true;
                },
              })}
            />
            {errors.todate && (
              <p className="text-sm text-red-600 flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4" />
                {errors.todate.message}
              </p>
            )}
          </div>
        </TabsContent>

        {/* Vehicle Information Tab */}
        <TabsContent value="vehicleInfo" className="space-y-4">
          <div className="space-y-2">
            <Label>Travel Mode</Label>
            <Controller
              name="travelmode"
              control={control}
              rules={{ required: "Travel mode is required" }}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    setTravelMode(value);
                  }}
                  value={field.value}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Travel Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {["Vehicle", "Walking"].map((mode) => (
                      <SelectItem key={mode} value={mode}>
                        {mode}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.travelmode && (
              <p className="text-sm text-red-600 flex items-center">
                <AlertTriangle className="mr-2 h-4 w-4" />
                {errors.travelmode.message}
              </p>
            )}
          </div>
          {travelMode === "Vehicle" ||
            (initialData?.travelmode == "Vehicle" && (
              <div className="">
                <div className="space-y-2">
                  <Label>Vehicle Type</Label>
                  <Controller
                    name="vehicleType"
                    control={control}
                    rules={{ required: "Vehicle type is required" }}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Vehicle Type" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Car", "Truck", "Bike", "Van", "Bus", "Other"].map(
                            (type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            )
                          )}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.vehicleType && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      {errors.vehicleType.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleNo">Vehicle Number</Label>
                  <Input
                    id="vehicleNo"
                    placeholder="Enter vehicle number"
                    {...register("vehicleNo", {
                      required: "Vehicle number is required",
                    })}
                  />
                  {errors.vehicleNo && (
                    <p className="text-sm text-red-600 flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      {errors.vehicleNo.message}
                    </p>
                  )}
                </div>
              </div>
            ))}
        </TabsContent>

        {/* Security Details Tab */}
        <TabsContent value="status" className="space-y-4">
          {loginUser?.role === "Department" && mode === "edit" && (
            <div className="space-y-2">
              <Label>Approval</Label>
              <Controller
                name="approvalstatus"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Approved", "Denied"].map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.approvalstatus && (
                <p className="text-sm text-red-600">
                  {errors.approvalstatus.message}
                </p>
              )}
            </div>
          )}

          {loginUser?.role === "Security" && mode === "edit" && (
            <>
              <div className="space-y-2">
                <Label>Status</Label>
                <Controller
                  name="visitorstatus"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {["Arrived", "Departed", "Scheduled", "Canceled"].map(
                          (status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.visitorstatus && (
                  <p className="text-sm text-red-600">
                    {errors.visitorstatus.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="arrivedtime">Arrived Time*</Label>
                <Input
                  type="datetime-local"
                  id="arrivedtime"
                  placeholder="Enter Arrival Time"
                  {...register("arrivedtime")}
                />
                {errors.arrivedtime && (
                  <p className="text-sm text-red-600">
                    {errors.arrivedtime.message}
                  </p>
                )}
              </div>
              {initialData?.arrivedtime !== null && (
                <div className="space-y-2">
                  <Label htmlFor="departedtime">Departed Time*</Label>
                  <Input
                    type="datetime-local"
                    id="departedtime"
                    placeholder="Enter Departure Time"
                    {...register("departedtime")}
                  />
                  {errors.departedtime && (
                    <p className="text-sm text-red-600">
                      {errors.departedtime.message}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>

      <div className="flex justify-between gap-2 mt-5">
        <Button
          type="button"
          onClick={handlePrevious}
          disabled={activeTab === "basicInfo"}
          className={`${
            activeTab === "basicInfo"
              ? "bg-gray-400"
              : "bg-gray-600 hover:bg-gray-800"
          } text-white items-start`}
        >
          Previous
        </Button>

        {activeTab === tabOrder[tabOrder.length - 1] ? (
          initialData?.approvalstatus !== "Denied" ? (
            <Button
              type="submit"
              className="bg-blue-900 text-white hover:bg-blue-900 hover:text-white"
            >
              {mode === "add" ? "Add Visitor" : "Save Changes"}
            </Button>
          ) : null
        ) : (
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleNext();
            }}
            className="bg-blue-900 text-white items-end hover:bg-blue-900 hover:text-white"
          >
            Next
          </Button>
        )}
      </div>
    </form>
  );
}
