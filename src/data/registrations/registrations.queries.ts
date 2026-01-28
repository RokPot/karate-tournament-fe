import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { QueryModule, InvalidateQueryOptions, invalidateQueries } from "@/data/invalidateQueries";
import { AppQueryOptions, AppMutationOptions } from "@/types/react-query";

import { RegistrationsApi } from "./registrations.api";
import { RegistrationsModels } from "./registrations.models";

export namespace RegistrationsQueries {
  export const moduleName = QueryModule.Registrations;

  export const keys = {
    all: [moduleName] as const,
    findOne: (id: string) => [...keys.all, "/registrations/:id", id] as const,
  };

  /**
   * Mutation `useCreate`
   * @summary Create a new registration
   * @description Creates a new registration for the authenticated user or a specified user (for coaches registering athletes)
   * @param { RegistrationsModels.CreateRegistrationDto } mutation.data Body parameter
   * @param { AppMutationOptions & InvalidateQueryOptions } options Mutation options
   * @returns { UseMutationResult<RegistrationsModels.RegistrationResponseDto> } Registration created
   * @statusCodes [201, 400, 401, 404, 409]
   */
  export const useCreate = (
    options?: AppMutationOptions<typeof RegistrationsApi.create, { data: RegistrationsModels.CreateRegistrationDto }> &
      InvalidateQueryOptions,
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ data }) => RegistrationsApi.create(data),
      ...options,
      onSuccess: (...args) => {
        invalidateQueries(queryClient, moduleName, options);
        options?.onSuccess?.(...args);
      },
    });
  };

  /**
   * Mutation `useCreateWithUser`
   * @summary Create a registration with user information (public)
   * @description Creates a user from email/name and then creates a registration. This endpoint is public and does not require authentication.
   * @param { RegistrationsModels.CreateRegistrationWithUserDto } mutation.data Body parameter
   * @param { AppMutationOptions & InvalidateQueryOptions } options Mutation options
   * @returns { UseMutationResult<RegistrationsModels.RegistrationResponseDto> } Registration created
   * @statusCodes [201, 400, 404, 409]
   */
  export const useCreateWithUser = (
    options?: AppMutationOptions<
      typeof RegistrationsApi.createWithUser,
      { data: RegistrationsModels.CreateRegistrationWithUserDto }
    > &
      InvalidateQueryOptions,
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ data }) => RegistrationsApi.createWithUser(data),
      ...options,
      onSuccess: (...args) => {
        invalidateQueries(queryClient, moduleName, options);
        options?.onSuccess?.(...args);
      },
    });
  };

  /**
   * Query `useFindOne`
   * @summary Get registration by ID
   * @description Retrieves a specific registration by its ID
   * @param { string } object.id Path parameter
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<RegistrationsModels.RegistrationResponseDto> } Registration found
   * @statusCodes [200, 401, 404]
   */
  export const useFindOne = <TData>(
    { id }: { id: string },
    options?: AppQueryOptions<typeof RegistrationsApi.findOne, TData>,
  ) => {
    return useQuery({
      queryKey: keys.findOne(id),
      queryFn: () => RegistrationsApi.findOne(id),
      ...options,
    });
  };
}
