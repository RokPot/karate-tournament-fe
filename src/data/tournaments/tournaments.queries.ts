import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { QueryModule, InvalidateQueryOptions, invalidateQueries } from "@/data/invalidateQueries";
import { AppQueryOptions, AppMutationOptions } from "@/types/react-query";

import { TournamentsApi } from "./tournaments.api";
import { TournamentsModels } from "./tournaments.models";

export namespace TournamentsQueries {
  export const moduleName = QueryModule.Tournaments;

  export const keys = {
    all: [moduleName] as const,
    findAll: () => [...keys.all, "/tournaments"] as const,
    findOne: (id: string) => [...keys.all, "/tournaments/:id", id] as const,
  };

  /**
   * Mutation `useCreate`
   * @summary Create a new tournament
   * @description Creates a new karate tournament
   * @param { TournamentsModels.CreateTournamentDto } mutation.data Body parameter
   * @param { AppMutationOptions & InvalidateQueryOptions } options Mutation options
   * @returns { UseMutationResult<TournamentsModels.TournamentResponseDto> } Tournament created successfully
   * @statusCodes [201, 400, 401]
   */
  export const useCreate = (
    options?: AppMutationOptions<typeof TournamentsApi.create, { data: TournamentsModels.CreateTournamentDto }> &
      InvalidateQueryOptions,
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ data }) => TournamentsApi.create(data),
      ...options,
      onSuccess: (...args) => {
        invalidateQueries(queryClient, moduleName, options);
        options?.onSuccess?.(...args);
      },
    });
  };

  /**
   * Query `useFindAll`
   * @summary Get all tournaments
   * @description Retrieves a list of all tournaments
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<TournamentsModels.TournamentsFindAllResponse> } List of tournaments
   * @statusCodes [200, 401]
   */
  export const useFindAll = <TData>(options?: AppQueryOptions<typeof TournamentsApi.findAll, TData>) => {
    return useQuery({
      queryKey: keys.findAll(),
      queryFn: TournamentsApi.findAll,
      ...options,
    });
  };

  /**
   * Query `useFindOne`
   * @summary Get tournament by ID
   * @description Retrieves a specific tournament by its ID
   * @param { string } object.id Path parameter. Tournament ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<TournamentsModels.TournamentResponseDto> } Tournament found
   * @statusCodes [200, 401, 404]
   */
  export const useFindOne = <TData>(
    { id }: { id: string },
    options?: AppQueryOptions<typeof TournamentsApi.findOne, TData>,
  ) => {
    return useQuery({
      queryKey: keys.findOne(id),
      queryFn: () => TournamentsApi.findOne(id),
      ...options,
    });
  };

  /**
   * Mutation `useUpdate`
   * @summary Update tournament
   * @description Updates an existing tournament
   * @param { string } mutation.id Path parameter. Tournament ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @param { TournamentsModels.UpdateTournamentDto } mutation.data Body parameter
   * @param { AppMutationOptions & InvalidateQueryOptions } options Mutation options
   * @returns { UseMutationResult<TournamentsModels.TournamentResponseDto> } Tournament updated successfully
   * @statusCodes [200, 400, 401, 404]
   */
  export const useUpdate = (
    options?: AppMutationOptions<
      typeof TournamentsApi.update,
      { id: string; data: TournamentsModels.UpdateTournamentDto }
    > &
      InvalidateQueryOptions,
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ id, data }) => TournamentsApi.update(id, data),
      ...options,
      onSuccess: (...args) => {
        invalidateQueries(queryClient, moduleName, options);
        options?.onSuccess?.(...args);
      },
    });
  };

  /**
   * Mutation `useRemove`
   * @summary Delete tournament
   * @description Deletes a tournament by ID
   * @param { string } mutation.id Path parameter. Tournament ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @param { AppMutationOptions & InvalidateQueryOptions } options Mutation options
   * @returns { UseMutationResult<void> } Tournament deleted successfully
   * @statusCodes [204, 401, 404]
   */
  export const useRemove = (
    options?: AppMutationOptions<typeof TournamentsApi.remove, { id: string }> & InvalidateQueryOptions,
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ id }) => TournamentsApi.remove(id),
      ...options,
      onSuccess: (...args) => {
        invalidateQueries(queryClient, moduleName, options);
        options?.onSuccess?.(...args);
      },
    });
  };
}
