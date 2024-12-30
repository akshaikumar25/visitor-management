"use client";
import React, { useEffect, useState, useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  Users,
  Home,
  UserCheck,
  LogOut,
  User2Icon,
  LayoutDashboard,
  LucideIcon,
  Phone,
  Building2,
  Mail,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RootState, AppDispatch } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import Lottie from "lottie-react";
import lottieJson from "@/public/lottie/loader.json";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbList,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { Society, User } from "@/types";
import { toast } from "sonner";
import Image from "next/image";

const ContentLoadingOverlay = () => (
  <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <Lottie
        animationData={lottieJson}
        className="w-full h-[400px] max-w-md"
      />
      <p className="text-gray-700 font-medium">Switching Society...</p>
    </div>
  </div>
);

interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

interface NavSection {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  title: string;
  url: string;
  items: NavItem[];
}

const getNavigationItems = (role: string): NavItem[] => {
  const baseItemsBeforeSociety: NavItem[] = [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Users", url: "/user", icon: Users },
  ];

  const baseItemsAfterSociety: NavItem[] = [
    { title: "Department/Office", url: "/department", icon: Building2 },
    { title: "Visitor Management", url: "/visitor", icon: UserCheck },
  ];

  const societyItem: NavItem = {
    title: "Society",
    url: "/society",
    icon: Users,
  };

  // For SuperAdmin and Admin, include Society in third position
  if (role === "SuperAdmin" || role === "Admin") {
    return [...baseItemsBeforeSociety, societyItem, ...baseItemsAfterSociety];
  }

  // For other roles, concatenate items without Society
  return [...baseItemsBeforeSociety, ...baseItemsAfterSociety];
};

// Initialize data with proper typing
const data: { navMain: NavSection[] } = {
  navMain: [
    {
      user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
      },
      title: "Navigation",
      url: "#",
      items: [], // This will be populated dynamically
    },
  ],
};

interface AppSidebarProps {
  children?: React.ReactNode;
}

export default function AppSidebar({ children }: AppSidebarProps) {
  const pathname = usePathname();
  const [activePage, setActivePage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const loginUsers: User | null = useSelector(
    (state: RootState) => state.user.user
  );
  useEffect(() => {
    if (loginUsers?.role) {
      data.navMain[0].items = getNavigationItems(loginUsers.role);
    }
  }, [loginUsers?.role]);

  const administrativeSociety = loginUsers?.administrativeSocity;
  const [selectedSociety, setSelectedSociety] = useState<
    string | number | undefined
  >(loginUsers?.currentSocietyId ?? undefined);

  const societyName = useMemo(() => {
    const societies = Array.isArray(loginUsers?.Society)
      ? loginUsers?.Society
      : [loginUsers?.Society];

    const currentSociety = societies.find(
      (society) => society?.id === loginUsers?.currentSocietyId
    );
    return currentSociety?.name ?? "No Society";
  }, [loginUsers?.role, loginUsers?.Society, loginUsers?.currentSocietyId]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const currentPage = data.navMain[0].items.find(
      (item) => item.url === pathname
    );
    if (currentPage) {
      setActivePage(currentPage.title);
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [pathname]);

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setActivePage("");
  };

  const dispatch = useDispatch<AppDispatch>();

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-blue-200 bg-white" collapsible="icon">
        {/* Logo Header */}
        <SidebarHeader className="bg-white py-2 px-2 hover:bg-none">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" className="w-full p-2">
                <div className="flex items-start justify-star">
                  <Image
                    src="/vms.png"
                    alt="Visitor Icon"
                    width={75} // Increased from 24
                    height={75}
                  />
                  <div className="flex flex-col mt-3">
                    <span className="font-bold text-sm text-blue-900 leading-tight">
                      Visitor
                    </span>
                    <span className="font-bold text-sm text-blue-900 leading-tight">
                      Management System
                    </span>
                  </div>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        {loginUsers?.role !== "SuperAdmin" && loginUsers?.role !== "Admin" && (
          <div className="space-y-4 bg-white px-5 py-3">
            <p className="text-blue-900 text-md p-2 rounded-sm border border-blue-200">
              Society : {societyName}
            </p>
          </div>
        )}

        {/* Main Navigation */}
        <SidebarContent className="space-y-4 bg-white px-1">
          {data.navMain.map((item) => (
            <SidebarGroup key={item.title} className="pt-1.5">
              <SidebarMenu className="space-y-1">
                {item.items.map((subItem) => {
                  const Icon = subItem.icon;
                  const isActive = pathname === subItem.url;
                  return (
                    <SidebarMenuItem key={subItem.title}>
                      <SidebarMenuButton
                        asChild
                        tooltip={subItem.title}
                        className="w-full"
                      >
                        <Link
                          href={subItem.url}
                          className={`
                            flex items-center gap-2.5 p-5 transition-all duration-300 ease-in-out
                            hover:bg-blue-50 hover:text-blue-900
                            rounded-sm
                            ${
                              isActive
                                ? "bg-blue-900 text-white font-medium"
                                : "text-blue-900"
                            }
                          `}
                        >
                          <Icon
                            className={`size-4.5 transition-colors duration-300 ${
                              isActive ? "text-white" : "text-blue-700"
                            }`}
                          />
                          <span className="text-md group-[[data-collapsible=icon]]/sidebar:hidden">
                            {subItem.title}
                          </span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <div className="h-px bg-white" />
        {/* Footer User Profile */}
        <div className="border-t border-blue-200 bg-white p-1">
          <div className="w-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="group flex w-full items-center justify-between rounded-md p-2 transition-all duration-300 ease-in-out hover:bg-blue-100 data-[state=open]:bg-blue-100">
                  <Avatar className="h-8 w-8 rounded-full ring-2 ring-blue-200 transition-transform duration-300 group-hover:scale-105 group-data-[state=open]:scale-105">
                    <AvatarImage />
                    <AvatarFallback className="bg-gradient-to-br from-blue-900 to-blue-900 text-white">
                      <User2Icon className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight mx-2">
                    <span className="truncate font-semibold text-blue-900 transition-colors duration-300 group-hover:text-blue-950 group-data-[state=open]:text-blue-950">
                      {loginUsers?.name}
                    </span>
                    <span className="truncate text-xs text-blue-800 transition-colors duration-300 group-hover:text-blue-950 group-data-[state=open]:text-blue-950">
                      {loginUsers?.email}
                    </span>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-80 overflow-hidden ml-5 rounded-lg p-3"
                side="top"
                align="end"
              >
                <div className=" rounded-md p-2 border border-blue-200">
                  <div className="space-y-3">
                    {[
                      {
                        icon: UserCheck,
                        label: "Name",
                        value: loginUsers?.name,
                      },
                      {
                        icon: Mail,
                        label: "Email",
                        value: loginUsers?.email,
                      },
                      {
                        icon: UserCheck,
                        label: "Role",
                        value: loginUsers?.role,
                      },
                      {
                        icon: Phone,
                        label: "Phone",
                        value: loginUsers?.phone,
                      },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-center gap-3">
                        <Icon className="size-5 text-blue-600 opacity-80 flex-shrink-0" />
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-xs text-blue-800">{label}</span>
                          <span className="truncate text-sm font-medium text-blue-900">
                            {value}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Logout Button */}
                <div className="mt-3">
                  <button
                    onClick={() => signOut()}
                    className="w-full flex items-center justify-center gap-3 rounded-md 
                     bg-white text-blue-900 border border-blue-300 px-4 py-2 
                      hover:bg-blue-900 hover:text-white"
                  >
                    <LogOut className="size-5" />
                    <span className="text-sm font-semibold">Log Out</span>
                  </button>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-blue-200 px-6 bg-white transition-[width,height] ease-in-out">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="block md:hidden ml-2 p-2 text-blue-800 hover:bg-blue-200 rounded-sm transition-all duration-200 ease-in-out" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    href="/user"
                    onClick={handleHomeClick}
                    className="text-blue-700 hover:text-blue-900 transition-colors duration-200"
                  >
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {activePage && (
                  <>
                    <BreadcrumbSeparator className="text-blue-800" />
                    <BreadcrumbItem>
                      <BreadcrumbPage className="text-blue-900 font-medium">
                        {activePage}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-6 bg-white overscroll-none">
          {isLoading ? <ContentLoadingOverlay /> : children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
