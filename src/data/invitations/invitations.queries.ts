import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  QueryModule,
  InvalidateQueryOptions,
  invalidateQueries,
} from "@/data/invalidateQueries";
import { AppQueryOptions, AppMutationOptions } from "@/types/react-query";
import { InvitationsApi } from "./invitations.api";

export namespace InvitationsQueries {
  export const moduleName = QueryModule.Invitations;

  export const keys = {
    all: [moduleName] as const,
    findAll: (clubId?: string) =>
      [...keys.all, "/invitations", clubId] as const,
    getByToken: (token: string) =>
      [...keys.all, "/invitations/by-token/:token", token] as const,
  };

  /**
   * Query `useFindAll`
   * @summary Get invitations
   * @description Lists invitations scoped by role. Admin sees all (optional clubId filter). Club owner/coach see their club. Empty list is 200 [].
   * @param { string } object.clubId Query parameter. Filter invitations by club ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<InvitationsModels.InvitationsFindAllResponse> } List of invitations
   * @statusCodes [200, 401, 403, 404]
   */
  export const useFindAll = <TData>(
    { clubId }: { clubId?: string },
    options?: AppQueryOptions<typeof InvitationsApi.findAll, TData>,
  ) => {
    return useQuery({
      queryKey: keys.findAll(clubId),
      queryFn: () => InvitationsApi.findAll(clubId),
      ...options,
    });
  };

  /**
   * Mutation `useCancel`
   * @summary Cancel invitation
   * @description Cancels a pending invitation. Admin or owner/coach of the invitation club.
   * @param { string } mutation.id Path parameter. Invitation ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @param { AppMutationOptions & InvalidateQueryOptions } options Mutation options
   * @returns { UseMutationResult<void> } Invitation cancelled
   * @statusCodes [204, 400, 401, 403, 404]
   */
  export const useCancel = (
    options?: AppMutationOptions<typeof InvitationsApi.cancel, { id: string }> &
      InvalidateQueryOptions,
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ id }) => InvitationsApi.cancel(id),
      ...options,
      onSuccess: (...args) => {
        invalidateQueries(queryClient, moduleName, options);
        options?.onSuccess?.(...args);
      },
    });
  };

  /**
   * Query `useGetByToken`
   * @summary Get invitation by token
   * @description Returns invitation details for the given token, including invitee identity. Public. Expired, cancelled, and accepted invites still return 200 with status.
   * @param { string } object.token Path parameter. Invitation token. Example: `abc123-uuid`
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<InvitationsModels.InvitationByTokenResponseDto> } Invitation details
   * @statusCodes [200, 404]
   */
  export const useGetByToken = <TData>(
    { token }: { token: string },
    options?: AppQueryOptions<typeof InvitationsApi.getByToken, TData>,
  ) => {
    return useQuery({
      queryKey: keys.getByToken(token),
      queryFn: () => InvitationsApi.getByToken(token),
      ...options,
    });
  };

  /**
   * Mutation `useAccept`
   * @summary Accept invitation
   * @description Accepts the invitation: copies empty profile fields from the invite, links the authenticated user to the club, and assigns the invitation role. Requires Auth0 JWT.
   * @param { string } mutation.token Path parameter. Invitation token. Example: `abc123-uuid`
   * @param { AppMutationOptions & InvalidateQueryOptions } options Mutation options
   * @returns { UseMutationResult<InvitationsModels.AcceptInvitationResponseDto> } Invitation accepted
   * @statusCodes [200, 201, 401, 404]
   */
  export const useAccept = (
    options?: AppMutationOptions<
      typeof InvitationsApi.accept,
      { token: string }
    > &
      InvalidateQueryOptions,
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ token }) => InvitationsApi.accept(token),
      ...options,
      onSuccess: (...args) => {
        invalidateQueries(queryClient, moduleName, options);
        options?.onSuccess?.(...args);
      },
    });
  };
}
