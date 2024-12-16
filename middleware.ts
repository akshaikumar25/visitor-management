import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {
  apiAuthPrefix,
  authRoutes,
  DEFAULT_LOGIN_REDIRECT,
  publicRoutes,
  managerRoutes,
  adminRoutes,
  superAdminRoutes,
} from "./routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const role = req.auth?.user.role;
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isManagerRoute = managerRoutes.includes(nextUrl.pathname);
  const isAdminRoute = adminRoutes.includes(nextUrl.pathname);
  const isSuperAdminRoute = superAdminRoutes.includes(nextUrl.pathname);
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  // const loginUsers: User | null = useSelector(
  //   (state: RootState) => state.user.user
  // );
  // console.log("---data",loginUsers)
  if (isApiAuthRoute) {
    return;
  }
  if (isPublicRoute) {
    return;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isLoggedIn) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  if (role === "Manager") {
    if (!isManagerRoute) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }
  if (role === "Admin") {
    if (!isAdminRoute) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (role === "SuperAdmin") {
    if (!isSuperAdminRoute) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }
  return;

  if (
    isLoggedIn &&
    isPublicRoute &&
    nextUrl.pathname !== DEFAULT_LOGIN_REDIRECT
  ) {
    return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
  }
}) as any;

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
