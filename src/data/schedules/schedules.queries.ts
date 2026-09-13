import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  QueryModule,
  InvalidateQueryOptions,
  invalidateQueries,
} from "@/data/invalidateQueries";
import { AppQueryOptions, AppMutationOptions } from "@/types/react-query";
import { SchedulesApi } from "./schedules.api";

export namespace SchedulesQueries {
  export const moduleName = QueryModule.Schedules;

  export const keys = {
    all: [moduleName] as const,
    findOne: (tournamentId: string, categoryId: string) =>
      [
        ...keys.all,
        "/tournaments/:tournamentId/categories/:categoryId/schedule",
        tournamentId,
        categoryId,
      ] as const,
  };

  /**
   * Mutation `useCreate`
   * @summary Generate a single-elimination schedule
   * @description Admin or owning club staff. Tournament must be in_progress. Persists one schedule per tournament category. Cannot regenerate while a schedule already exists.
   * @param { string } mutation.tournamentId Path parameter. Tournament ID
   * @param { string } mutation.categoryId Path parameter. Category ID
   * @param { AppMutationOptions & InvalidateQueryOptions } options Mutation options
   * @returns { UseMutationResult<SchedulesModels.ScheduleResponseDto> } Schedule created
   * @statusCodes [201, 400, 401, 403, 404, 409]
   */
  export const useCreate = (
    options?: AppMutationOptions<
      typeof SchedulesApi.create,
      { tournamentId: string; categoryId: string }
    > &
      InvalidateQueryOptions,
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ tournamentId, categoryId }) =>
        SchedulesApi.create(tournamentId, categoryId),
      ...options,
      onSuccess: (...args) => {
        invalidateQueries(queryClient, moduleName, options);
        options?.onSuccess?.(...args);
      },
    });
  };

  /**
   * Query `useFindOne`
   * @summary Get the schedule for a tournament category
   * @description Admin or owning club staff.
   * @param { string } object.tournamentId Path parameter. Tournament ID
   * @param { string } object.categoryId Path parameter. Category ID
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<SchedulesModels.ScheduleResponseDto> } Schedule found
   * @statusCodes [200, 401, 403, 404]
   */
  export const useFindOne = <TData>(
    { tournamentId, categoryId }: { tournamentId: string; categoryId: string },
    options?: AppQueryOptions<typeof SchedulesApi.findOne, TData>,
  ) => {
    return useQuery({
      queryKey: keys.findOne(tournamentId, categoryId),
      queryFn: () => SchedulesApi.findOne(tournamentId, categoryId),
      ...options,
    });
  };
}
