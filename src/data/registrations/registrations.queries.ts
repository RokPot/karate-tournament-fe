import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  QueryModule,
  InvalidateQueryOptions,
  invalidateQueries,
} from "@/data/invalidateQueries";
import { AppQueryOptions, AppMutationOptions } from "@/types/react-query";
import { RegistrationsModels } from "./registrations.models";
import { RegistrationsApi } from "./registrations.api";

export namespace RegistrationsQueries {
  export const moduleName = QueryModule.Registrations;

  export const keys = {
    all: [moduleName] as const,
    getPublicSuitableCategories: (
      tournamentId: string,
      weight: number,
      beltLevel: RegistrationsModels.GetPublicSuitableCategoriesBeltLevelParam,
      dateOfBirth: string,
      gender?: RegistrationsModels.GetPublicSuitableCategoriesGenderParam,
    ) =>
      [
        ...keys.all,
        "/registrations/public/suitable-categories",
        tournamentId,
        weight,
        beltLevel,
        dateOfBirth,
        gender,
      ] as const,
    findByTournament: (tournamentId: string, categoryId?: string) =>
      [
        ...keys.all,
        "/registrations/by-tournament",
        tournamentId,
        categoryId,
      ] as const,
    getSuitableCategories: (userId: string, tournamentId: string) =>
      [
        ...keys.all,
        "/registrations/suitable-categories",
        userId,
        tournamentId,
      ] as const,
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
    options?: AppMutationOptions<
      typeof RegistrationsApi.create,
      { data: RegistrationsModels.CreateRegistrationDto }
    > &
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
   * Mutation `useBulkCreateWithCoach`
   * @summary Bulk register participants with coach (public)
   * @description Creates or updates a coach user, then registers multiple participants. Partial success: failed items are returned in results with error messages.
   * @param { RegistrationsModels.BulkPublicRegistrationDto } mutation.data Body parameter
   * @param { AppMutationOptions & InvalidateQueryOptions } options Mutation options
   * @returns { UseMutationResult<RegistrationsModels.BulkPublicRegistrationResponseDto> } Bulk registration processed
   * @statusCodes [201, 400, 404]
   */
  export const useBulkCreateWithCoach = (
    options?: AppMutationOptions<
      typeof RegistrationsApi.bulkCreateWithCoach,
      { data: RegistrationsModels.BulkPublicRegistrationDto }
    > &
      InvalidateQueryOptions,
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ data }) => RegistrationsApi.bulkCreateWithCoach(data),
      ...options,
      onSuccess: (...args) => {
        invalidateQueries(queryClient, moduleName, options);
        options?.onSuccess?.(...args);
      },
    });
  };

  /**
   * Query `useGetPublicSuitableCategories`
   * @summary Get suitable categories by attributes (public)
   * @description Returns tournament categories matching weight, age, and belt. Optionally pass gender to include gender-restricted categories. No authentication required.
   * @param { string } object.tournamentId Query parameter. Tournament ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @param { number } object.weight Query parameter. Weight in kg. Example: `65`
   * @param { RegistrationsModels.GetPublicSuitableCategoriesBeltLevelParam } object.beltLevel Query parameter. Belt level. Example: `7-kyu`
   * @param { string } object.dateOfBirth Query parameter. Date of birth. Example: `2018-02-02T00:00:00.000Z`
   * @param { RegistrationsModels.GetPublicSuitableCategoriesGenderParam } object.gender Query parameter. Gender (omit to exclude categories with a gender restriction). Example: `male`
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<RegistrationsModels.GetPublicSuitableCategoriesResponse> } Suitable categories
   * @statusCodes [200, 404]
   */
  export const useGetPublicSuitableCategories = <TData>(
    {
      tournamentId,
      weight,
      beltLevel,
      dateOfBirth,
      gender,
    }: {
      tournamentId: string;
      weight: number;
      beltLevel: RegistrationsModels.GetPublicSuitableCategoriesBeltLevelParam;
      dateOfBirth: string;
      gender?: RegistrationsModels.GetPublicSuitableCategoriesGenderParam;
    },
    options?: AppQueryOptions<
      typeof RegistrationsApi.getPublicSuitableCategories,
      TData
    >,
  ) => {
    return useQuery({
      queryKey: keys.getPublicSuitableCategories(
        tournamentId,
        weight,
        beltLevel,
        dateOfBirth,
        gender,
      ),
      queryFn: () =>
        RegistrationsApi.getPublicSuitableCategories(
          tournamentId,
          weight,
          beltLevel,
          dateOfBirth,
          gender,
        ),
      ...options,
    });
  };

  /**
   * Mutation `useGetBulkPublicSuitableCategories`
   * @summary Get suitable categories for multiple participants (public)
   * @description Returns each participant with tournament categories they are eligible for (weight, age, belt, and gender when provided).
   * @param { RegistrationsModels.BulkPublicSuitableCategoriesDto } mutation.data Body parameter
   * @param { AppMutationOptions & InvalidateQueryOptions } options Mutation options
   * @returns { UseMutationResult<RegistrationsModels.GetBulkPublicSuitableCategoriesResponse> } Suitable categories per participant
   * @statusCodes [200, 201, 404]
   */
  export const useGetBulkPublicSuitableCategories = (
    options?: AppMutationOptions<
      typeof RegistrationsApi.getBulkPublicSuitableCategories,
      { data: RegistrationsModels.BulkPublicSuitableCategoriesDto }
    > &
      InvalidateQueryOptions,
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ data }) =>
        RegistrationsApi.getBulkPublicSuitableCategories(data),
      ...options,
      onSuccess: (...args) => {
        invalidateQueries(queryClient, moduleName, options);
        options?.onSuccess?.(...args);
      },
    });
  };

  /**
   * Mutation `useGetSuitableParticipantsByCategory`
   * @summary Get suitable participants per category (public)
   * @description Returns each tournament category with participants eligible for it (weight, age, belt, and gender when provided). Participants are matched by request array index via participantIndex.
   * @param { RegistrationsModels.BulkPublicSuitableCategoriesDto } mutation.data Body parameter
   * @param { AppMutationOptions & InvalidateQueryOptions } options Mutation options
   * @returns { UseMutationResult<RegistrationsModels.GetSuitableParticipantsByCategoryResponse> } Eligible participants per category
   * @statusCodes [200, 201, 404]
   */
  export const useGetSuitableParticipantsByCategory = (
    options?: AppMutationOptions<
      typeof RegistrationsApi.getSuitableParticipantsByCategory,
      { data: RegistrationsModels.BulkPublicSuitableCategoriesDto }
    > &
      InvalidateQueryOptions,
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ data }) =>
        RegistrationsApi.getSuitableParticipantsByCategory(data),
      ...options,
      onSuccess: (...args) => {
        invalidateQueries(queryClient, moduleName, options);
        options?.onSuccess?.(...args);
      },
    });
  };

  /**
   * Query `useFindByTournament`
   * @summary List registrations for a tournament
   * @description Returns all registrations for the given tournament. Optionally filter by categoryId to return only registrations in that category.
   * @param { string } object.tournamentId Query parameter. Tournament ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @param { string } object.categoryId Query parameter. Category ID — when set, only registrations for this category are returned. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<RegistrationsModels.FindByTournamentResponse> } Registrations list
   * @statusCodes [200, 401, 404]
   */
  export const useFindByTournament = <TData>(
    { tournamentId, categoryId }: { tournamentId: string; categoryId?: string },
    options?: AppQueryOptions<typeof RegistrationsApi.findByTournament, TData>,
  ) => {
    return useQuery({
      queryKey: keys.findByTournament(tournamentId, categoryId),
      queryFn: () =>
        RegistrationsApi.findByTournament(tournamentId, categoryId),
      ...options,
    });
  };

  /**
   * Query `useGetSuitableCategories`
   * @summary Get categories suitable for a user in a tournament
   * @description Returns tournament categories for which the user meets weight, age, belt, and gender requirements.
   * @param { string } object.userId Query parameter. User ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @param { string } object.tournamentId Query parameter. Tournament ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<RegistrationsModels.GetSuitableCategoriesResponse> } Suitable categories
   * @statusCodes [200, 401, 404]
   */
  export const useGetSuitableCategories = <TData>(
    { userId, tournamentId }: { userId: string; tournamentId: string },
    options?: AppQueryOptions<
      typeof RegistrationsApi.getSuitableCategories,
      TData
    >,
  ) => {
    return useQuery({
      queryKey: keys.getSuitableCategories(userId, tournamentId),
      queryFn: () =>
        RegistrationsApi.getSuitableCategories(userId, tournamentId),
      ...options,
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
