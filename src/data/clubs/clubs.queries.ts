import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { QueryModule, InvalidateQueryOptions, invalidateQueries } from "@/data/invalidateQueries";
import { AppQueryOptions, AppMutationOptions } from "@/types/react-query";

import { ClubsApi } from "./clubs.api";
import { ClubsModels } from "./clubs.models";

export namespace ClubsQueries {
  export const moduleName = QueryModule.Clubs;

  export const keys = {
    all: [moduleName] as const,
    findAll: () => [...keys.all, "/clubs"] as const,
    getMembers: (id: string) => [...keys.all, "/clubs/:id/members", id] as const,
    getTournaments: (id: string) => [...keys.all, "/clubs/:id/tournaments", id] as const,
    findOne: (id: string) => [...keys.all, "/clubs/:id", id] as const,
  };

  /**
   * Mutation `useCreate`
   * @summary Create a new club
   * @description Creates a new karate club. When ownerEmail is provided, an invitation is created and inviteUrl is returned.
   * @param { ClubsModels.CreateClubDto } mutation.data Body parameter
   * @param { AppMutationOptions & InvalidateQueryOptions } options Mutation options
   * @returns { UseMutationResult<CommonModels.ClubResponseDto> } Club created successfully
   * @statusCodes [201, 400, 401]
   */
  export const useCreate = (
    options?: AppMutationOptions<typeof ClubsApi.create, { data: ClubsModels.CreateClubDto }> & InvalidateQueryOptions,
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ data }) => ClubsApi.create(data),
      ...options,
      onSuccess: (...args) => {
        invalidateQueries(queryClient, moduleName, options);
        options?.onSuccess?.(...args);
      },
    });
  };

  /**
   * Query `useFindAll`
   * @summary Get all clubs
   * @description Retrieves a list of all clubs
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<ClubsModels.ClubsFindAllResponse> } List of clubs
   * @statusCodes [200, 401]
   */
  export const useFindAll = <TData>(options?: AppQueryOptions<typeof ClubsApi.findAll, TData>) => {
    return useQuery({
      queryKey: keys.findAll(),
      queryFn: ClubsApi.findAll,
      ...options,
    });
  };

  /**
   * Query `useGetMembers`
   * @summary Get club members
   * @description Retrieves users (members) of the club
   * @param { string } object.id Path parameter. Club ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<ClubsModels.GetMembersResponse> } List of club members
   * @statusCodes [200, 401, 404]
   */
  export const useGetMembers = <TData>(
    { id }: { id: string },
    options?: AppQueryOptions<typeof ClubsApi.getMembers, TData>,
  ) => {
    return useQuery({
      queryKey: keys.getMembers(id),
      queryFn: () => ClubsApi.getMembers(id),
      ...options,
    });
  };

  /**
   * Query `useGetTournaments`
   * @summary Get club tournaments
   * @description Retrieves tournaments assigned to the club
   * @param { string } object.id Path parameter. Club ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<ClubsModels.GetTournamentsResponse> } List of tournaments
   * @statusCodes [200, 401, 404]
   */
  export const useGetTournaments = <TData>(
    { id }: { id: string },
    options?: AppQueryOptions<typeof ClubsApi.getTournaments, TData>,
  ) => {
    return useQuery({
      queryKey: keys.getTournaments(id),
      queryFn: () => ClubsApi.getTournaments(id),
      ...options,
    });
  };

  /**
   * Query `useFindOne`
   * @summary Get club by ID
   * @description Retrieves a specific club by its ID
   * @param { string } object.id Path parameter. Club ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<CommonModels.ClubResponseDto> } Club found
   * @statusCodes [200, 401, 404]
   */
  export const useFindOne = <TData>(
    { id }: { id: string },
    options?: AppQueryOptions<typeof ClubsApi.findOne, TData>,
  ) => {
    return useQuery({
      queryKey: keys.findOne(id),
      queryFn: () => ClubsApi.findOne(id),
      ...options,
    });
  };

  /**
   * Mutation `useUpdate`
   * @summary Update club
   * @description Updates an existing club
   * @param { string } mutation.id Path parameter. Club ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @param { ClubsModels.UpdateClubDto } mutation.data Body parameter
   * @param { AppMutationOptions & InvalidateQueryOptions } options Mutation options
   * @returns { UseMutationResult<CommonModels.ClubResponseDto> } Club updated successfully
   * @statusCodes [200, 400, 401, 404]
   */
  export const useUpdate = (
    options?: AppMutationOptions<typeof ClubsApi.update, { id: string; data: ClubsModels.UpdateClubDto }> &
      InvalidateQueryOptions,
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ id, data }) => ClubsApi.update(id, data),
      ...options,
      onSuccess: (...args) => {
        invalidateQueries(queryClient, moduleName, options);
        options?.onSuccess?.(...args);
      },
    });
  };

  /**
   * Mutation `useRemove`
   * @summary Delete club
   * @description Deletes a club by ID
   * @param { string } mutation.id Path parameter. Club ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @param { AppMutationOptions & InvalidateQueryOptions } options Mutation options
   * @returns { UseMutationResult<void> } Club deleted successfully
   * @statusCodes [204, 401, 404]
   */
  export const useRemove = (
    options?: AppMutationOptions<typeof ClubsApi.remove, { id: string }> & InvalidateQueryOptions,
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ id }) => ClubsApi.remove(id),
      ...options,
      onSuccess: (...args) => {
        invalidateQueries(queryClient, moduleName, options);
        options?.onSuccess?.(...args);
      },
    });
  };
}
