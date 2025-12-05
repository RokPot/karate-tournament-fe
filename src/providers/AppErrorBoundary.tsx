import * as Sentry from "@sentry/react";
import React, { PropsWithChildren } from "react";

import { ErrorFallback, ErrorFallbackProps } from "@/components/shared/error/ErrorFallback";

const Fallback = (props: ErrorFallbackProps) => <ErrorFallback {...props} />;

export const AppErrorBoundary = ({ children }: PropsWithChildren) => {
  return <Sentry.ErrorBoundary fallback={Fallback}>{children}</Sentry.ErrorBoundary>;
};
