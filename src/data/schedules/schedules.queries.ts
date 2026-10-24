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
    downloadTournament: (
      tournamentId: string,
      generateMissing?: boolean,
      scoreCount?: number,
    ) =>
      [
        ...keys.all,
        "/tournaments/:tournamentId/brackets/pdf",
        tournamentId,
        generateMissing,
        scoreCount,
      ] as const,
    downloadCategory: (
      tournamentId: string,
      categoryId: string,
      generateMissing?: boolean,
      scoreCount?: number,
    ) =>
      [
        ...keys.all,
        "/tournaments/:tournamentId/categories/:categoryId/bracket/pdf",
        tournamentId,
        categoryId,
        generateMissing,
        scoreCount,
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

  /**
   * Mutation `useRegenerate`
   * @summary Regenerate the single-elimination schedule
   * @description Admin or owning club staff. Tournament must be in_progress. Deletes the existing schedule (games, matches, and scores) and rebuilds from current participants. 409 if no schedule exists yet.
   * @param { string } mutation.tournamentId Path parameter. Tournament ID
   * @param { string } mutation.categoryId Path parameter. Category ID
   * @param { AppMutationOptions & InvalidateQueryOptions } options Mutation options
   * @returns { UseMutationResult<SchedulesModels.ScheduleResponseDto> } Schedule regenerated
   * @statusCodes [200, 201, 400, 401, 403, 404, 409]
   */
  export const useRegenerate = (
    options?: AppMutationOptions<
      typeof SchedulesApi.regenerate,
      { tournamentId: string; categoryId: string }
    > &
      InvalidateQueryOptions,
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ tournamentId, categoryId }) =>
        SchedulesApi.regenerate(tournamentId, categoryId),
      ...options,
      onSuccess: (...args) => {
        invalidateQueries(queryClient, moduleName, options);
        options?.onSuccess?.(...args);
      },
    });
  };

  /**
   * Query `useDownloadTournament`
   * @summary Download all category brackets as one PDF
   * @description Admin or owning club staff. One A4 landscape page per category, in tournament category order. By default only categories that already have a schedule are printed; pass generateMissing&#x3D;true to generate schedules for categories that have at least 2 competitors (tournament must be in_progress).
   * @param { string } object.tournamentId Path parameter. Tournament ID
   * @param { boolean } object.generateMissing Query parameter. When true, categories that have no schedule yet are generated first (needs at least 2 competitors; tournament must be in_progress). When false or omitted, only existing schedules are printed.
   * @param { number } object.scoreCount Query parameter. Blank handwritten score cells per match, plus one Sum cell. 0 hides the score row. Defaults to 5.. Maximum: `8`. Example: `5`
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<z.instanceof(Blob)> } PDF file
   * @statusCodes [200, 400, 401, 403, 404]
   */
  export const useDownloadTournament = <TData>(
    {
      tournamentId,
      generateMissing,
      scoreCount,
    }: { tournamentId: string; generateMissing?: boolean; scoreCount?: number },
    options?: AppQueryOptions<typeof SchedulesApi.downloadTournament, TData>,
  ) => {
    return useQuery({
      queryKey: keys.downloadTournament(
        tournamentId,
        generateMissing,
        scoreCount,
      ),
      queryFn: () =>
        SchedulesApi.downloadTournament(
          tournamentId,
          generateMissing,
          scoreCount,
        ),
      ...options,
    });
  };

  /**
   * Query `useDownloadCategory`
   * @summary Download one category bracket as a PDF
   * @description Admin or owning club staff. Same rules as the tournament export. With generateMissing&#x3D;true a missing schedule is created first (400 if the tournament is not in progress or there are fewer than 2 competitors).
   * @param { string } object.tournamentId Path parameter. Tournament ID
   * @param { string } object.categoryId Path parameter. Category ID
   * @param { boolean } object.generateMissing Query parameter. When true, categories that have no schedule yet are generated first (needs at least 2 competitors; tournament must be in_progress). When false or omitted, only existing schedules are printed.
   * @param { number } object.scoreCount Query parameter. Blank handwritten score cells per match, plus one Sum cell. 0 hides the score row. Defaults to 5.. Maximum: `8`. Example: `5`
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<z.instanceof(Blob)> } PDF file
   * @statusCodes [200, 400, 401, 403, 404]
   */
  export const useDownloadCategory = <TData>(
    {
      tournamentId,
      categoryId,
      generateMissing,
      scoreCount,
    }: {
      tournamentId: string;
      categoryId: string;
      generateMissing?: boolean;
      scoreCount?: number;
    },
    options?: AppQueryOptions<typeof SchedulesApi.downloadCategory, TData>,
  ) => {
    return useQuery({
      queryKey: keys.downloadCategory(
        tournamentId,
        categoryId,
        generateMissing,
        scoreCount,
      ),
      queryFn: () =>
        SchedulesApi.downloadCategory(
          tournamentId,
          categoryId,
          generateMissing,
          scoreCount,
        ),
      ...options,
    });
  };
}
