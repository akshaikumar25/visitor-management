/**
 * An array of routes that are accesible to the public
 * There routes do not need authendication
 * @type {string[]}
 */

export const publicRoutes = [
  "/access-denied",
  "/",
  "/privacypolicy",
  "/termsandconditions",
];
/**
 * An array of routes that are used for authendication
 * There routes will redirect logged in user to /setting pag
 * @type {string[]}
 */

export const authRoutes = ["/auth/login"];

/**
 * There routes do not need authendication and dont stop by middleware ever.
 * @type {string}
 */

export const apiAuthPrefix = "/api";
/**
 * Default redirect path after login
 * @type {string}
 */

export const DEFAULT_LOGIN_REDIRECT = "/dashboard";

/**
 * An array of routes that are used for authendication
 * There routes will redirect logged in user to /setting page
 * @type {string[]}
 */

export const managerRoutes = [
  "/user",
  "/dashboard",
  "/watertruck",
  "/apartment",
  "/visitor",
  "/vehicle",
  "/clean-log",
  "/inventory",
];

export const adminRoutes = [
  "/user",
  "/society",
  "/dashboard",
  "/apartment",
  "/watertruck",
  "/visitor",
  "/vehicle",
  "/clean-log",
  "/inventory",
];

export const superAdminRoutes = [
  "/user",
  "/society",
  "/dashboard",
  "/watertruck",
  "/apartment",
  "/visitor",
  "/vehicle",
  "/clean-log",
  "/inventory",
];
