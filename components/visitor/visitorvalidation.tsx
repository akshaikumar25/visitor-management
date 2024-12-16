import { z } from "zod";

export const visitorSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters" })
      .max(50, { message: "Name cannot exceed 50 characters" }),
    phone: z
      .string()
      .min(10, { message: "Phone number must be at least 10 digits" })
      .max(15, { message: "Phone number cannot exceed 15 digits" })
      .regex(/^\d+$/, { message: "Phone number must contain only digits" }),
    address: z
      .string()
      .min(5, { message: "Address must be at least 5 characters" })
      .max(200, { message: "Address cannot exceed 200 characters" }),
    visitorscount: z
      .number()
      .min(1, { message: "Visitors count must be at least 1" })
      .max(10, { message: "Visitors count cannot exceed 10" }),
    apartmentId: z.string().min(1, { message: "Apartment is required" }),
    fromdate: z.string().min(1, { message: "From date is required" }),
    todate: z.string().min(1, { message: "To date is required" }),
    arrivedtime: z.string().optional(),
    departedtime: z.string().optional(),
    purpose: z.string().optional(),
    travelmode: z.string().optional(),
    vehicleType: z.string().optional(),
    vehicleNo: z.string().optional(),
    visitorstatus: z.string().optional(),
    approvalstatus: z.string().optional(),
    createdby: z.string().optional(),
    createdbyrole: z.string().optional(),
    image: z.string().optional(),
    idproof: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.fromdate || !data.todate) return true;

      const fromDateTime = new Date(data.fromdate).getTime();
      const toDateTime = new Date(data.todate).getTime();

      return toDateTime > fromDateTime;
    },
    {
      message: "To date must be greater than to From date",
      path: ["todate"],
    }
  );

export type VisitorSchema = z.infer<typeof visitorSchema>;
