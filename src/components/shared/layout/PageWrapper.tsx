import { cx } from "class-variance-authority";
import { useRouter } from "next/router";
import { PropsWithChildren, useMemo } from "react";

import { InviteAcceptHandler } from "@/components/invitations/InviteAcceptHandler";
import { CompleteProfilePrompt } from "@/components/profile/CompleteProfilePrompt";
import { LoadingState } from "@/components/shared/layout/LoadingState";
import Footer from "@/components/shared/layout/footer/Footer";

import { Navbar } from "./navbar/Navbar";

export const PageWrapper = ({ children }: PropsWithChildren) => {
  const router = useRouter();
  const isLandingPage = router.pathname === "/";
  const isLoggedIn = true;
  const isCheckingAuth = false;

  const shouldShowFooter = useMemo(() => {
    return isLoggedIn && !isLandingPage;
  }, [isLoggedIn, isLandingPage]);

  if (isCheckingAuth) {
    return <LoadingState />;
  }

  return (
    <div
      style={{
        height: "100dvh",
        position: "relative",
      }}
      className={cx("flex flex-col min-h-0 flex-1")}
    >
      {!isLandingPage && <Navbar />}
      <div className={cx("flex h-full max-h-full min-h-0")}>
        <main
          className="flex min-h-0 flex-1 flex-col overflow-y-auto"
          style={{

            flexBasis: "0",
          }}
          id="scroll-container"
        >
          <InviteAcceptHandler>
            <CompleteProfilePrompt />
            {children}
          </InviteAcceptHandler>
          {shouldShowFooter && <Footer />}
        </main>
      </div>
    </div>
  );
};
