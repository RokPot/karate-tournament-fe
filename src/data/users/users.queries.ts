import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { QueryModule, InvalidateQueryOptions, invalidateQueries } from "@/data/invalidateQueries";
import { AppQueryOptions, AppMutationOptions } from "@/types/react-query";

import { UsersApi } from "./users.api";
import { UsersModels } from "./users.models";

export namespace UsersQueries {
  export const moduleName = QueryModule.Users;

  export const keys = {
    all: [moduleName] as const,
    getProfile: () => [...keys.all, "/users/me"] as const,
    findOne: (id: string) => [...keys.all, "/users/:id", id] as const,
  };

  /**
   * Query `useGetProfile`
   * @summary Get current user profile
   * @description Retrieves the profile of the currently authenticated user
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<CommonModels.UserResponseDto> } User profile
   * @statusCodes [200, 401]
   */
  export const useGetProfile = <TData>(options?: AppQueryOptions<typeof UsersApi.getProfile, TData>) => {
    return useQuery({
      queryKey: keys.getProfile(),
      queryFn: UsersApi.getProfile,
      ...options,
    });
  };

  /**
   * Mutation `useUpdateProfile`
   * @summary Update current user profile
   * @description Updates the profile of the currently authenticated user
   * @param { UsersModels.UpdateUserDto } mutation.data Body parameter
   * @param { AppMutationOptions & InvalidateQueryOptions } options Mutation options
   * @returns { UseMutationResult<CommonModels.UserResponseDto> } User profile updated
   * @statusCodes [200, 400, 401]
   */
  export const useUpdateProfile = (
    options?: AppMutationOptions<typeof UsersApi.updateProfile, { data: UsersModels.UpdateUserDto }> &
      InvalidateQueryOptions,
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ data }) => UsersApi.updateProfile(data),
      ...options,
      onSuccess: (...args) => {
        invalidateQueries(queryClient, moduleName, options);
        options?.onSuccess?.(...args);
      },
    });
  };

  /**
   * Query `useFindOne`
   * @summary Get user by ID
   * @description Retrieves a specific user by their ID
   * @param { string } object.id Path parameter
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<CommonModels.UserResponseDto> } User found
   * @statusCodes [200, 401, 404]
   */
  export const useFindOne = <TData>(
    { id }: { id: string },
    options?: AppQueryOptions<typeof UsersApi.findOne, TData>,
  ) => {
    return useQuery({
      queryKey: keys.findOne(id),
      queryFn: () => UsersApi.findOne(id),
      ...options,
    });
  };
}
