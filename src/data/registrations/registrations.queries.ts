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
    getCurrentRoster: (accessToken: string) =>
      [
        ...keys.all,
        "/registrations/public/rosters/current",
        accessToken,
      ] as const,
    getPublicSuitableCategories: (
      tournamentId: string,
      beltLevel: RegistrationsModels.GetPublicSuitableCategoriesBeltLevelParam,
      dateOfBirth: string,
      weight?: number,
      gender?: RegistrationsModels.GetPublicSuitableCategoriesGenderParam,
    ) =>
      [
        ...keys.all,
        "/registrations/public/suitable-categories",
        tournamentId,
        beltLevel,
        dateOfBirth,
        weight,
        gender,
      ] as const,
    findCountsByTournament: (tournamentId: string) =>
      [
        ...keys.all,
        "/registrations/by-tournament/counts",
        tournamentId,
      ] as const,
    findSubmissionsByTournament: (tournamentId: string) =>
      [
        ...keys.all,
        "/registrations/by-tournament/submissions",
        tournamentId,
      ] as const,
    findByTournament: (tournamentId: string, categoryId?: string) =>
      [
        ...keys.all,
        "/registrations/by-tournament",
        tournamentId,
        categoryId,
      ] as const,
    findByUser: (
      userId: string,
      tournamentId?: string,
      status?: RegistrationsModels.FindByUserStatusParam,
    ) =>
      [
        ...keys.all,
        "/registrations/by-user",
        userId,
        tournamentId,
        status,
      ] as const,
    getSuitableCategories: (userId: string, tournamentId: string) =>
      [
        ...keys.all,
        "/registrations/suitable-categories",
        userId,
        tournamentId,
      ] as const,
    findMine: (
      tournamentId?: string,
      status?: RegistrationsModels.FindMineStatusParam,
    ) => [...keys.all, "/registrations/me", tournamentId, status] as const,
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
   * Mutation `useCreateForStaff`
   * @summary Add a participant to a category (staff)
   * @description Admin or owner of the hosting club. Finds or creates the participant (by email when given, otherwise club + name + date of birth) and registers them in one individual category. Tournament must be approved or in progress. Team categories are rejected.
   * @param { RegistrationsModels.CreateStaffRegistrationDto } mutation.data Body parameter
   * @param { AppMutationOptions & InvalidateQueryOptions } options Mutation options
   * @returns { UseMutationResult<RegistrationsModels.RegistrationResponseDto> } Registration created
   * @statusCodes [201, 400, 401, 403, 404, 409]
   */
  export const useCreateForStaff = (
    options?: AppMutationOptions<
      typeof RegistrationsApi.createForStaff,
      { data: RegistrationsModels.CreateStaffRegistrationDto }
    > &
      InvalidateQueryOptions,
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ data }) => RegistrationsApi.createForStaff(data),
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
   * Mutation `useLookupRoster`
   * @summary Check whether a public registration roster exists
   * @description Looks up a coach + club roster for a tournament. Returns found + updatedAt only — never participant data.
   * @param { RegistrationsModels.RosterIdentityDto } mutation.data Body parameter
   * @param { AppMutationOptions & InvalidateQueryOptions } options Mutation options
   * @returns { UseMutationResult<RegistrationsModels.RosterLookupResponseDto> } Lookup result
   * @statusCodes [200, 404]
   */
  export const useLookupRoster = (
    options?: AppMutationOptions<
      typeof RegistrationsApi.lookupRoster,
      { data: RegistrationsModels.RosterIdentityDto }
    > &
      InvalidateQueryOptions,
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ data }) => RegistrationsApi.lookupRoster(data),
      ...options,
      onSuccess: (...args) => {
        invalidateQueries(queryClient, moduleName, options);
        options?.onSuccess?.(...args);
      },
    });
  };

  /**
   * Mutation `useRequestRosterOtp`
   * @summary Email a one-time code to continue a registration roster
   * @description Sends a 6-digit code to the coach email when a roster exists for this tournament and club.
   * @param { RegistrationsModels.RosterOtpRequestDto } mutation.data Body parameter
   * @param { AppMutationOptions & InvalidateQueryOptions } options Mutation options
   * @returns { UseMutationResult<RegistrationsModels.RosterOtpResponseDto> } Code sent (debugCode only when mail is disabled outside production)
   * @statusCodes [200, 404, 429]
   */
  export const useRequestRosterOtp = (
    options?: AppMutationOptions<
      typeof RegistrationsApi.requestRosterOtp,
      { data: RegistrationsModels.RosterOtpRequestDto }
    > &
      InvalidateQueryOptions,
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ data }) => RegistrationsApi.requestRosterOtp(data),
      ...options,
      onSuccess: (...args) => {
        invalidateQueries(queryClient, moduleName, options);
        options?.onSuccess?.(...args);
      },
    });
  };

  /**
   * Mutation `useVerifyRosterOtp`
   * @summary Verify roster OTP
   * @description Exchanges a valid email code for a short-lived accessToken used on GET/PUT current roster.
   * @param { RegistrationsModels.RosterOtpVerifyDto } mutation.data Body parameter
   * @param { AppMutationOptions & InvalidateQueryOptions } options Mutation options
   * @returns { UseMutationResult<RegistrationsModels.RosterOtpVerifyResponseDto> } Access token
   * @statusCodes [200, 400, 404]
   */
  export const useVerifyRosterOtp = (
    options?: AppMutationOptions<
      typeof RegistrationsApi.verifyRosterOtp,
      { data: RegistrationsModels.RosterOtpVerifyDto }
    > &
      InvalidateQueryOptions,
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ data }) => RegistrationsApi.verifyRosterOtp(data),
      ...options,
      onSuccess: (...args) => {
        invalidateQueries(queryClient, moduleName, options);
        options?.onSuccess?.(...args);
      },
    });
  };

  /**
   * Query `useGetCurrentRoster`
   * @summary Get the current public registration roster
   * @description Merged latest athletes and teams for the coach + club. Pass accessToken from OTP verify as a query param.
   * @param { string } object.accessToken Query parameter. Access token from OTP verify. Min Length: `16`
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<RegistrationsModels.RosterResponseDto> } Current roster
   * @statusCodes [200, 401, 404]
   */
  export const useGetCurrentRoster = <TData>(
    { accessToken }: { accessToken: string },
    options?: AppQueryOptions<typeof RegistrationsApi.getCurrentRoster, TData>,
  ) => {
    return useQuery({
      queryKey: keys.getCurrentRoster(accessToken),
      queryFn: () => RegistrationsApi.getCurrentRoster(accessToken),
      ...options,
    });
  };

  /**
   * Mutation `usePutCurrentRoster`
   * @summary Replace the current public registration roster
   * @description Updates athletes and teams in place (no new submission). accessToken and updatedAt are required in the body.
   * @param { RegistrationsModels.RosterPutDto } mutation.data Body parameter
   * @param { AppMutationOptions & InvalidateQueryOptions } options Mutation options
   * @returns { UseMutationResult<RegistrationsModels.RosterResponseDto> } Updated roster
   * @statusCodes [200, 401, 409]
   */
  export const usePutCurrentRoster = (
    options?: AppMutationOptions<
      typeof RegistrationsApi.putCurrentRoster,
      { data: RegistrationsModels.RosterPutDto }
    > &
      InvalidateQueryOptions,
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ data }) => RegistrationsApi.putCurrentRoster(data),
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
   * @description Returns tournament categories matching age and belt. Weight is optional and skipped for categories with no weight limits. Optionally pass gender to include gender-restricted categories. No authentication required.
   * @param { string } object.tournamentId Query parameter. Tournament ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @param { RegistrationsModels.GetPublicSuitableCategoriesBeltLevelParam } object.beltLevel Query parameter. Belt level. Example: `7-kyu`
   * @param { string } object.dateOfBirth Query parameter. Date of birth. Example: `2018-02-02T00:00:00.000Z`
   * @param { number } object.weight Query parameter. Weight in kg (omit when unknown; skipped for categories with no weight limits). Example: `65`
   * @param { RegistrationsModels.GetPublicSuitableCategoriesGenderParam } object.gender Query parameter. Gender (omit to exclude categories with a gender restriction). Example: `male`
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<RegistrationsModels.GetPublicSuitableCategoriesResponse> } Suitable categories
   * @statusCodes [200, 404]
   */
  export const useGetPublicSuitableCategories = <TData>(
    {
      tournamentId,
      beltLevel,
      dateOfBirth,
      weight,
      gender,
    }: {
      tournamentId: string;
      beltLevel: RegistrationsModels.GetPublicSuitableCategoriesBeltLevelParam;
      dateOfBirth: string;
      weight?: number;
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
        beltLevel,
        dateOfBirth,
        weight,
        gender,
      ),
      queryFn: () =>
        RegistrationsApi.getPublicSuitableCategories(
          tournamentId,
          beltLevel,
          dateOfBirth,
          weight,
          gender,
        ),
      ...options,
    });
  };

  /**
   * Mutation `useGetBulkPublicSuitableCategories`
   * @summary Get suitable categories for multiple participants (public)
   * @description Returns each participant with tournament categories they are eligible for (age, belt, gender when provided, and weight when provided). Weight is skipped for categories with no weight limits.
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
   * @description Returns each tournament category with participants eligible for it, plus otherEligibleParticipants who only fit a configured feeder category (team categories with a positive feeder limit). Weight is skipped for categories with no weight limits. Participants are matched by request array index via participantIndex.
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
   * Query `useFindCountsByTournament`
   * @summary Get registration counts per assigned category
   * @description Returns one row per category assigned to the tournament, including categories with zero registrations. Ordered by tournament category sort order.
   * @param { string } object.tournamentId Query parameter. Tournament ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<RegistrationsModels.FindCountsByTournamentResponse> } Registration counts per assigned category
   * @statusCodes [200, 401, 403, 404]
   */
  export const useFindCountsByTournament = <TData>(
    { tournamentId }: { tournamentId: string },
    options?: AppQueryOptions<
      typeof RegistrationsApi.findCountsByTournament,
      TData
    >,
  ) => {
    return useQuery({
      queryKey: keys.findCountsByTournament(tournamentId),
      queryFn: () => RegistrationsApi.findCountsByTournament(tournamentId),
      ...options,
    });
  };

  /**
   * Query `useFindSubmissionsByTournament`
   * @summary List registration submits for a tournament, grouped by coach and club
   * @description Returns one group per coach + club. Group fees are the combined bill across that coach’s submits (1/2/3+ discounts apply across sends). Nested submits keep this-submit-only fees. Legacy registrations without a submit are omitted (use GET /registrations/by-tournament).
   * @param { string } object.tournamentId Query parameter. Tournament ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<RegistrationsModels.FindSubmissionsByTournamentResponse> } Registration submit groups
   * @statusCodes [200, 401, 403, 404]
   */
  export const useFindSubmissionsByTournament = <TData>(
    { tournamentId }: { tournamentId: string },
    options?: AppQueryOptions<
      typeof RegistrationsApi.findSubmissionsByTournament,
      TData
    >,
  ) => {
    return useQuery({
      queryKey: keys.findSubmissionsByTournament(tournamentId),
      queryFn: () => RegistrationsApi.findSubmissionsByTournament(tournamentId),
      ...options,
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
   * @statusCodes [200, 401, 403, 404]
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
   * Query `useFindByUser`
   * @summary List registrations for a user
   * @description Returns registrations for the given user. Caller must be the user, an admin, or club staff of the user&#x27;s current club. Optionally filter by tournamentId and status.
   * @param { string } object.userId Query parameter. User ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @param { string } object.tournamentId Query parameter. Filter by tournament ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @param { RegistrationsModels.FindByUserStatusParam } object.status Query parameter. Filter by registration status. Example: `pending`
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<RegistrationsModels.FindByUserResponse> } Registrations list
   * @statusCodes [200, 401, 403, 404]
   */
  export const useFindByUser = <TData>(
    {
      userId,
      tournamentId,
      status,
    }: {
      userId: string;
      tournamentId?: string;
      status?: RegistrationsModels.FindByUserStatusParam;
    },
    options?: AppQueryOptions<typeof RegistrationsApi.findByUser, TData>,
  ) => {
    return useQuery({
      queryKey: keys.findByUser(userId, tournamentId, status),
      queryFn: () => RegistrationsApi.findByUser(userId, tournamentId, status),
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
   * Query `useFindMine`
   * @summary Get current user registrations
   * @description Returns registrations for the authenticated caller only. Optionally filter by tournamentId and status.
   * @param { string } object.tournamentId Query parameter. Filter by tournament ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @param { RegistrationsModels.FindMineStatusParam } object.status Query parameter. Filter by registration status. Example: `pending`
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<RegistrationsModels.FindMineResponse> } Caller registrations
   * @statusCodes [200, 401, 404]
   */
  export const useFindMine = <TData>(
    {
      tournamentId,
      status,
    }: {
      tournamentId?: string;
      status?: RegistrationsModels.FindMineStatusParam;
    },
    options?: AppQueryOptions<typeof RegistrationsApi.findMine, TData>,
  ) => {
    return useQuery({
      queryKey: keys.findMine(tournamentId, status),
      queryFn: () => RegistrationsApi.findMine(tournamentId, status),
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

  /**
   * Mutation `useUpdateIdentity`
   * @summary Edit the participant behind a registration (staff)
   * @description Admin or owner of the hosting club. Updates the participant profile (name, gender, date of birth, weight, belt) so their other registrations stay consistent, and optionally this registration&#x27;s finalWeight. Every individual category the person is registered in for this tournament is re-checked; if any no longer fits the request is rejected and nothing changes. Tournament must be approved or in progress.
   * @param { string } mutation.id Path parameter
   * @param { RegistrationsModels.UpdateRegistrationIdentityDto } mutation.data Body parameter
   * @param { AppMutationOptions & InvalidateQueryOptions } options Mutation options
   * @returns { UseMutationResult<RegistrationsModels.RegistrationResponseDto> } Registration updated
   * @statusCodes [200, 400, 401, 403, 404]
   */
  export const useUpdateIdentity = (
    options?: AppMutationOptions<
      typeof RegistrationsApi.updateIdentity,
      { id: string; data: RegistrationsModels.UpdateRegistrationIdentityDto }
    > &
      InvalidateQueryOptions,
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ id, data }) => RegistrationsApi.updateIdentity(id, data),
      ...options,
      onSuccess: (...args) => {
        invalidateQueries(queryClient, moduleName, options);
        options?.onSuccess?.(...args);
      },
    });
  };

  /**
   * Mutation `useUpdate`
   * @summary Update a registration
   * @description Updates category, final weight, and/or status. Admin, staff of the registering club, or staff of the hosting club. Tournament must be approved or in progress. Category schedule is not updated automatically.
   * @param { string } mutation.id Path parameter
   * @param { RegistrationsModels.UpdateRegistrationDto } mutation.data Body parameter
   * @param { AppMutationOptions & InvalidateQueryOptions } options Mutation options
   * @returns { UseMutationResult<RegistrationsModels.RegistrationResponseDto> } Registration updated
   * @statusCodes [200, 400, 401, 403, 404, 409]
   */
  export const useUpdate = (
    options?: AppMutationOptions<
      typeof RegistrationsApi.update,
      { id: string; data: RegistrationsModels.UpdateRegistrationDto }
    > &
      InvalidateQueryOptions,
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ id, data }) => RegistrationsApi.update(id, data),
      ...options,
      onSuccess: (...args) => {
        invalidateQueries(queryClient, moduleName, options);
        options?.onSuccess?.(...args);
      },
    });
  };

  /**
   * Mutation `useRemove`
   * @summary Delete a registration
   * @description Removes a registration. Admin or owner of the hosting club. Tournament must be approved or in progress. Team roster rows for this registration are removed. Category schedule is not updated automatically.
   * @param { string } mutation.id Path parameter
   * @param { AppMutationOptions & InvalidateQueryOptions } options Mutation options
   * @returns { UseMutationResult<void> } Registration deleted
   * @statusCodes [204, 400, 401, 403, 404]
   */
  export const useRemove = (
    options?: AppMutationOptions<
      typeof RegistrationsApi.remove,
      { id: string }
    > &
      InvalidateQueryOptions,
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ id }) => RegistrationsApi.remove(id),
      ...options,
      onSuccess: (...args) => {
        invalidateQueries(queryClient, moduleName, options);
        options?.onSuccess?.(...args);
      },
    });
  };
}
