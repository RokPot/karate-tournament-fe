import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { QueryModule, InvalidateQueryOptions, invalidateQueries } from "@/data/invalidateQueries";
import { AppQueryOptions, AppMutationOptions } from "@/types/react-query";

import { TestApi } from "./test.api";
import { TestModels } from "./test.models";

export namespace TestQueries {
  export const moduleName = QueryModule.Test;

  export const keys = {
    all: [moduleName] as const,
    get: () => [...keys.all, "/test"] as const,
    echoPath: (message: string) => [...keys.all, "/test/echo/:message", message] as const,
  };

  /**
   * Query `useGet`
   * @summary Simple GET endpoint
   * @description A public endpoint that returns a simple response
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<TestModels.TestGetResponseDto> } Successful response
   * @statusCodes [200]
   */
  export const useGet = <TData>(options?: AppQueryOptions<typeof TestApi.get, TData>) => {
    return useQuery({
      queryKey: keys.get(),
      queryFn: TestApi.get,
      ...options,
    });
  };

  /**
   * Mutation `usePost`
   * @summary POST endpoint with body
   * @description Accepts a JSON body and returns it with metadata
   * @param { TestModels.TestRequestDto } mutation.data Body parameter
   * @param { AppMutationOptions & InvalidateQueryOptions } options Mutation options
   * @returns { UseMutationResult<TestModels.TestResponseDto> } Successfully created
   * @statusCodes [201, 400, 401]
   */
  export const usePost = (
    options?: AppMutationOptions<typeof TestApi.post, { data: TestModels.TestRequestDto }> & InvalidateQueryOptions,
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ data }) => TestApi.post(data),
      ...options,
      onSuccess: (...args) => {
        invalidateQueries(queryClient, moduleName, options);
        options?.onSuccess?.(...args);
      },
    });
  };

  /**
   * Query `useEchoPath`
   * @summary Echo endpoint with path parameter
   * @description Echoes back a message from the URL path
   * @param { string } object.message Path parameter. Message to echo back. Example: `hello-world`
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<TestModels.TestEchoResponseDto> } Echoed message
   * @statusCodes [200]
   */
  export const useEchoPath = <TData>(
    { message }: { message: string },
    options?: AppQueryOptions<typeof TestApi.echoPath, TData>,
  ) => {
    return useQuery({
      queryKey: keys.echoPath(message),
      queryFn: () => TestApi.echoPath(message),
      ...options,
    });
  };
}
