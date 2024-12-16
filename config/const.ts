import { CustomErrorDetails } from "@/types";
import { BuildingIcon, CarIcon, Inspect, LineChartIcon, PackageIcon, TruckIcon, UserIcon, UsersIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import { MdCleanHands } from "react-icons/md";
import { TbHome, TbLogout, TbReload } from "react-icons/tb";


export const DEFAULT_LOGIN_REDIRECT = "/";

// Replace with the actual icon library you're using

export const Items = [
  {
    href: "/dashboard",
    icon: LineChartIcon, // Dashboard usually associated with analytics or charts
    label: "Dashboard",
    isActive: true,
    isAdditional: false,
    isBottom: false,
  },
  {
    href: "/user",
    icon: UserIcon, // User management
    label: "User",
    isActive: true,
    isAdditional: false,
    isBottom: false,
  },
  {
    href: "/society",
    icon: UsersIcon, // Society might represent a group of people, so UsersIcon fits
    label: "Society",
    isActive: true,
    isAdditional: false,
    isBottom: false,
  },
  {
    href: "/guest",
    icon: PackageIcon, // Could represent a guest or external entity
    label: "Guest",
    isActive: true,
    isAdditional: false,
    isBottom: false,
  },
  {
    href: "/apartment",
    icon: BuildingIcon, // Icon representing a building or apartment
    label: "Apartment",
    isActive: true,
    isAdditional: false,
    isBottom: false,
  },
  // {
  //   href: "/vehicle",
  //   icon: CarIcon, // Vehicle could be represented by a truck or car icon
  //   label: "Vehicle",
  //   isActive: true,
  //   isAdditional: false,
  //   isBottom: false,
  // },
  {
    href: "/watertruck",
    icon: TruckIcon, // Water tanker can be represented with a truck icon
    label: "Water Tanker",
    isActive: true,
    isAdditional: false,
    isBottom: false,
  },
  {
    href: "/inventory",
    icon: Inspect, // Vehicle could be represented by a truck or car icon
    label: "Inventory",
    isActive: true,
    isAdditional: false,
    isBottom: false,
  },
  {
    href: "/clean-log",
    icon: MdCleanHands, // Water tanker can be represented with a truck icon
    label: "Cleaning Logs",
    isActive: true,
    isAdditional: false,
    isBottom: false,
  },
];

export const customErrorDetails: CustomErrorDetails = {
  "NO_INTERNET_CONNECTION": {
    title: "No Internet Connection",
    description: "Please check your internet connection and try again.",
    image: null,
    lottie: null,
    redirectButton: [
      {
        label: "Reload",
        icon: TbReload,
        action: () => {
          window.location.reload();
        },
        redirectLink: null,
      }
    ]
  }, 
  "USER_NOT_FOUND": {
    title: "User Not Found",
    description: "We couldn't find the user account you're looking for. This may be because the account has been deleted, the user ID is incorrect, or your session has expired.",
    image: null,
    lottie: null,
    redirectButton: [
      {
        label: "Go to Home",
        icon: TbHome,
        action: ()=>{},
        redirectLink: "/"
      },
      {
        label: "Try Again",
        icon: TbReload,
        action: () => {
          window.location.reload();
        },
        redirectLink: null
      },
      {
        label: "Sign Out",
        icon: TbLogout,
        action: () => {
          signOut();
        },
        redirectLink: null
      }
    ]
  },
  "ACCESS_DENIED": {
    title: "Access Denied",
    description: "You don't have permission to access this resource.",
    image: null,
    lottie: null,
    redirectButton: [
     
      {
        label: "Login With Another Account",
        icon: TbLogout,
        action: () => {
          signOut({ callbackUrl: "/auth/login" });
        },
        redirectLink: null
      }
    ]
  },
  "PAGE_NOT_FOUND": {
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist or has been removed.",
    image: null,
    lottie: null,
    redirectButton: [
      {
        label: "Go to Home",
        icon: TbHome,
        action: () => {
        },
        redirectLink: "/dashboard"
      }
    ]
  },
  "ERROR": {
    title: "Error",
    description: "An error occurred while processing your request. Please try again later.",
    image: null,
    lottie: null,
    redirectButton: [
      {
        label: "Retry",
        icon: TbReload,
        action: () => {
          window.location.reload();
        },
        redirectLink: null
      },
      {
        label: "Relogin",
        icon: TbLogout,
        action: () => {
          signOut({ callbackUrl: "/auth/login" });
        },
        redirectLink: null
      },
      {
        label: "Go to Home",
        icon: TbHome,
        action: () => {},
        redirectLink: "/dashboard"
      }
    ]
  },
  "SHOP_NOT_FOUND": {
    title: "Society Not Found",
    description: "The society you're looking for doesn't exist or has been removed.",
    image: null,
    lottie: null,
    redirectButton: [
      
      {
        label: "Sign Out and Login Again",
        icon: TbLogout,
        action: () => {
          signOut({ callbackUrl: "/auth/login" });
        },
        redirectLink: null
      }
    ]
  },
  
}

