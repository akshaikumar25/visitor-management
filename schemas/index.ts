import * as z from "zod";

export const credentialLoginSchema = z.object({
  username: z
    .string()
    .min(1, "user name is required")
    .refine((val) => val.trim().length > 0, {
      message: "Please enter an username",
    }),
  password: z
    .string()
    .min(1, "Password is required")
    .refine((val) => val.trim().length > 0, {
      message: "Please enter a password",
    }),
});

export const UserSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  email: z.string().min(1, { message: "Email is required" }),
  phonenumber: z
    .string()
    .min(10, { message: "Mobile number is required" })
    .max(10, { message: "Mobile number is required" }),
  password: z.string().optional(),
});

export const phoneLoginSchema = z.object({
  phonenumber: z
    .string()
    .min(10, "Enter a valid phone number")
    .max(10, "Enter a valid phone number"),
});


export const waterTankerSchema = z.object({
  id: z.number().optional(),
  timeIn: z.date(),
  timeOut: z.date(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});


export const vehicleTypeEnum = z.enum([
  'Car', 
  'Truck', 
  'Bike', 
  'Van', 
  'Bus', 
  'Tractor', 
  'Trailer', 
  'Other'
]);

export const VehiclePassSchema = z.object({
  id: z.number().optional(),
  vehicleNo: z.string().min(1, 'Vehicle number is required'),
  issueDate: z.date(),
  expiryDate: z.date(),
  vehicleType: vehicleTypeEnum,
});