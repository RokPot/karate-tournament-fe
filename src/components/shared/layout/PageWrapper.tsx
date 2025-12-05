import { cx } from "class-variance-authority";
import { PropsWithChildren, useMemo } from "react";

import { LoadingState } from "@/components/shared/layout/LoadingState";
import Footer from "@/components/shared/layout/footer/Footer";

import { Navbar } from "./navbar/Navbar";

export const PageWrapper = ({ children }: PropsWithChildren) => {
  const isLoggedIn  = true;
  const isCheckingAuth = false;

  const shouldShowFooter = useMemo(() => {
    return (
      isLoggedIn
    );
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
      className={cx(
        "flex bg-secondary-400",
         "flex-col",
      )}
    >
      <Navbar />
      <div className={cx("flex",  "h-full")}>
        <main
          className="flex flex-1 flex-col"
          style={{
            overflowY: "auto",
            overflowX: "hidden",
            flexBasis: "0",
          }}
          id="scroll-container"
        >
          {children}
          {shouldShowFooter && <Footer />}
        </main>
      </div>
    </div>
  );
};
