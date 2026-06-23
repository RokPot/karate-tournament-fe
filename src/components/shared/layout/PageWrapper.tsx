import { cx } from "class-variance-authority";
import { PropsWithChildren, useMemo } from "react";

import { InviteAcceptHandler } from "@/components/invitations/InviteAcceptHandler";
import { LoadingState } from "@/components/shared/layout/LoadingState";
import Footer from "@/components/shared/layout/footer/Footer";

import { Navbar } from "./navbar/Navbar";

export const PageWrapper = ({ children }: PropsWithChildren) => {
  const isLoggedIn = true;
  const isCheckingAuth = false;

  const shouldShowFooter = useMemo(() => {
    return isLoggedIn;
  }, [isLoggedIn]);

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
      <Navbar />
      <div className={cx("flex h-full max-h-full overflow-y-auto")}>
        <main
          className="flex flex-1 flex-col"
          style={{

            flexBasis: "0",
          }}
          id="scroll-container"
        >
          <InviteAcceptHandler />
          {children}
          {shouldShowFooter && <Footer />}
        </main>
      </div>
    </div>
  );
};
