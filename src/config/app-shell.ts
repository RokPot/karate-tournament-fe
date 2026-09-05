export type AppShellConfig = {
  sidebar?: boolean;
};

const SIDEBAR_HIDDEN_PATHNAMES = new Set([
  "/sign-in",
  "/sign-up",
  "/bug-report",
  "/invite/[token]",
  "/tournament/[id]/registration",
]);

export const normalizePathname = (pathname: string) =>
  pathname.replace(/\/+$/, "") || "/";

export const shouldShowAppSidebar = (
  pathname: string,
  override?: AppShellConfig,
) => {
  if (override?.sidebar !== undefined) {
    return override.sidebar;
  }
  return !SIDEBAR_HIDDEN_PATHNAMES.has(normalizePathname(pathname));
};

export const isAppNavLinkActive = (href: string, pathname: string) => {
  const current = normalizePathname(pathname);
  const target = normalizePathname(href);
  if (target === "/dashboard") {
    return current === "/dashboard";
  }
  return current === target || current.startsWith(`${target}/`);
};
