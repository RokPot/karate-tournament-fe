import { Drawer } from "@mui/material";
import { cx } from "class-variance-authority";
import { useRouter } from "next/router";
import { PropsWithChildren, useMemo, useState } from "react";

import { InviteAcceptHandler } from "@/components/invitations/InviteAcceptHandler";
import { CompleteProfilePrompt } from "@/components/profile/CompleteProfilePrompt";
import { LoadingState } from "@/components/shared/layout/LoadingState";
import Footer from "@/components/shared/layout/footer/Footer";
import {
  AppShellConfig,
  shouldShowAppSidebar,
} from "@/config/app-shell";

import { Navbar } from "./navbar/Navbar";
import { AppSidebar } from "./sidebar/AppSidebar";

interface PageWrapperProps extends PropsWithChildren {
  shell?: AppShellConfig;
}

export const PageWrapper = ({ children, shell }: PageWrapperProps) => {
  const router = useRouter();
  const isLandingPage = router.pathname === "/";
  const showSidebar =
    !isLandingPage && shouldShowAppSidebar(router.pathname, shell);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const isLoggedIn = true;
  const isCheckingAuth = false;

  const shouldShowFooter = useMemo(() => {
    return isLoggedIn && !isLandingPage;
  }, [isLoggedIn, isLandingPage]);

  if (isCheckingAuth) {
    return <LoadingState />;
  }

  if (isLandingPage) {
    return (
      <div className="relative flex min-h-0 flex-1 flex-col" style={{ height: "100dvh" }}>
        <main
          className="flex min-h-0 flex-1 flex-col overflow-y-auto"
          id="scroll-container"
        >
          <InviteAcceptHandler>
            <CompleteProfilePrompt />
            {children}
          </InviteAcceptHandler>
        </main>
      </div>
    );
  }

  return (
    <div
      className={cx(
        "relative min-h-0 flex-1 grid grid-cols-1 grid-rows-[70px_1fr]",
        showSidebar && "t:grid-cols-[260px_1fr]",
      )}
      style={{ height: "100dvh" }}
    >
      {showSidebar && (
        <aside className="hidden min-h-0 t:col-start-1 t:row-span-2 t:row-start-1 t:flex t:flex-col t:border-r t:border-secondary-300">
          <AppSidebar />
        </aside>
      )}
      <div
        className={cx(
          "col-start-1 row-start-1",
          showSidebar && "t:col-start-2",
        )}
      >
        <Navbar
          showLogo={!showSidebar}
          showMenuButton={showSidebar}
          onMenuClick={() => setMobileNavOpen(true)}
        />
        {showSidebar && (
          <Drawer
            open={mobileNavOpen}
            onClose={() => setMobileNavOpen(false)}
            className="t:hidden"
          >
            <div className="h-full w-[260px]">
              <AppSidebar onNavigate={() => setMobileNavOpen(false)} />
            </div>
          </Drawer>
        )}
      </div>
      <main
        className={cx(
          "col-start-1 row-start-2 flex min-h-0 flex-col overflow-y-auto",
          showSidebar && "t:col-start-2",
        )}
        id="scroll-container"
      >
        <InviteAcceptHandler>
          <CompleteProfilePrompt />
          {children}
        </InviteAcceptHandler>
        {shouldShowFooter && <Footer />}
      </main>
    </div>
  );
};
