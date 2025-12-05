import { QueryClient } from "@tanstack/react-query";

export namespace QueriesUtils {
  export const prefetchMultipleQueries = (
    queryClient: QueryClient,
    queries: Array<(queryClient: QueryClient) => Promise<void>>,
  ) => {
    return Promise.all(queries.map((query) => query(queryClient)));
  };
}
