import { QueryClientConfig } from "@tanstack/react-query";

import { ApplicationException, GeneralErrorCodes } from "@/util/vendor/error-handling";

export const QueryConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      staleTime: 2 * 60 * 1000,
    },
  },
};

declare module "@tanstack/react-query" {
  interface Register {
    defaultError: ApplicationException<GeneralErrorCodes> | null;
  }
}
