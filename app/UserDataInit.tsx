"use client";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchUser } from "@/reducers/user.reducer";
import { authRoutes, publicRoutes } from "../routes";
import dynamic from "next/dynamic";
import CustomLoadingScreen from "@/components/common/customLoadingScreen";
import { useOnlineStatus } from "@/lib/utils";
import { toast } from "sonner";
import Lottie from "lottie-react";
import lottieJson from "@/public/lottie/loader.json";

const CustomErrorScreen = dynamic(
  () => import("@/components/common/customErrorScreen"),
  { ssr: false }
);

const UserDataInitializer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const pathname = usePathname();
  const { status: sessionStatus } = useSession();
  const dispatch = useDispatch<AppDispatch>();
  const { status: userStatus, user: userData } = useSelector(
    (state: RootState) => state.user
  );
  const isOnline = useOnlineStatus();
  const [isMounted, setIsMounted] = useState(false);

  const initializeUser = useCallback(async () => {
    if (
      sessionStatus === "authenticated" &&
      !authRoutes.includes(pathname) &&
      (!userData || userStatus === "idle") &&
      isOnline
    ) {
      try {
        const res = await dispatch(fetchUser()).unwrap();
      } catch (error) {
        toast.error("Failed to fetch user datas");
      }
    }
  }, [sessionStatus, pathname, userData, userStatus, dispatch, isOnline]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      initializeUser();
    }
  }, [isMounted, initializeUser]);

  const roleBasedContent = useMemo(() => ({ children }), []);

  // if (!isMounted) {
  //   return null; // or return a loading indicator
  // }

  // if (!isOnline) {
  //   return <CustomErrorScreen type="offline" />;
  // }

  // if (authRoutes.includes(pathname) || publicRoutes.includes(pathname)) {
  //   return children;
  // }

  // if (sessionStatus === "loading" || userStatus === "loading") {
  //   return <CustomLoadingScreen />;
  // }

  // if (sessionStatus === "loading") {
  //   return (
  //     <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex items-center justify-center">
  //       <div className="flex flex-col items-center gap-4">
  //         <Lottie
  //           animationData={lottieJson}
  //           className="w-full h-[400px] max-w-md"
  //         />
  //         <p className="text-gray-700 font-medium">Loading...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (sessionStatus === "unauthenticated") {
  //   return <CustomErrorScreen type="unauthenticated" />;
  // }

  // if (!userData || userStatus === "failed") {
  //   return <CustomErrorScreen type="failed" />;
  // }

  // return (
  //   <>
  //     <CustomErrorScreen type="failed" />
  //   </>
  // );

  return children;
};

export default UserDataInitializer;
