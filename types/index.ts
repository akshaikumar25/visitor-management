import { User } from "lucide-react";
import { IconType } from "react-icons";

export interface RedirectButton {
  label: string;
  icon: IconType | null;
  action: () => void | null;
  redirectLink: string | null;
}

export interface ErrorDetail {
  title: string;
  description: string;
  image: string | null;
  lottie: any | null; // Replace 'any' with the specific type of your Lottie animation data if known
  redirectButton: RedirectButton[];
}

export interface CustomErrorDetails {
  [key: string]: ErrorDetail;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  currentSocietyId?: number;
  societyId?: number;
  apartment?: ApartmentInfo[];
  administrativeSocity?: Society[];
  currentSociety?: Society[];
  Society?: Society[];
  apartmentId?: number | null;
}

export interface ApartmentInfo {
  id?: number;
  name: string;
  userId?: number;
  owner?: User;
  users?: User;
  Visitor: VisitorInfo[];
  societyId?: number;
  society?: Society;
}
export interface Society {
  id?: number;
  name: string;
  admins?: number[];
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  adminNames?: User[];
  Apartment?: ApartmentInfo[];
  User?: User[];
  email?: string | null;
  website?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TableResponse {
  success: boolean;
  message: string;
  data: Society[];
  pagination: Pagination;
}

export interface TableResponseUser {
  success: boolean;
  message: string;
  data: User[];
  pagination: Pagination;
}

export interface GetQueryParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface VisitorInfo {
  id: number;
  name: string;
  phone: string;
  address?: string;
  image?: string;
  idproof?: string;
  visitorscount?: number;
  apartmentId: number;
  apartment: ApartmentInfo;
  purpose?: string;
  fromdate: Date;
  todate: Date;
  travelmode?: string;
  vehicleType?: VehicleType;
  vehicleNo?: string;
  approvalstatus?: ApprovalStatus;
  visitorstatus?: VisitorStatus;
  arrivedtime?: Date;
  departedtime?: Date;
  createdAt: string;
  createdby: string | undefined;
  createdbyrole: string | undefined;
  updatedAt: string;
}

export enum VehicleType {
  Car = "Car",
  Truck = "Truck",
  Bike = "Bike",
  Van = "Van",
  Bus = "Bus",
  Tractor = "Tractor",
  Trailer = "Trailer",
  Other = "Other",
}

export enum VisitorStatus {
  Scheduled = "Scheduled",
  Arrived = "Arrived",
  Departed = "Departed",
  Canceled = "Canceled",
}

export enum ApprovalStatus {
  Approved = "Approved",
  Denied = "Denied",
  Pending = "Pending",
}
