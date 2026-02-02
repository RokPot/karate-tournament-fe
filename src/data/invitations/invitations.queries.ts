import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { QueryModule, InvalidateQueryOptions, invalidateQueries } from "@/data/invalidateQueries";
import { AppQueryOptions, AppMutationOptions } from "@/types/react-query";

import { InvitationsApi } from "./invitations.api";

export namespace InvitationsQueries {
  export const moduleName = QueryModule.Invitations;

  export const keys = {
    all: [moduleName] as const,
    findAll: () => [...keys.all, "/invitations"] as const,
    getByToken: (token: string) => [...keys.all, "/invitations/by-token/:token", token] as const,
  };

  /**
   * Query `useFindAll`
   * @summary Get all invitations
   * @description Retrieves a list of all invitations, newest first. Requires Auth0 JWT.
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<InvitationsModels.InvitationsFindAllResponse> } List of invitations
   * @statusCodes [200, 401]
   */
  export const useFindAll = <TData>(options?: AppQueryOptions<typeof InvitationsApi.findAll, TData>) => {
    return useQuery({
      queryKey: keys.findAll(),
      queryFn: InvitationsApi.findAll,
      ...options,
    });
  };

  /**
   * Query `useGetByToken`
   * @summary Get invitation by token
   * @description Returns invitation details (club name, expiry) for the given token. Public. Used by frontend to show &quot;You&#x27;re invited to join X&quot; before redirecting to Auth0.
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
   * @description Accepts the invitation: links the authenticated user to the club and assigns club owner role. Requires Auth0 JWT.
   * @param { string } mutation.token Path parameter. Invitation token. Example: `abc123-uuid`
   * @param { AppMutationOptions & InvalidateQueryOptions } options Mutation options
   * @returns { UseMutationResult<InvitationsModels.AcceptInvitationResponseDto> } Invitation accepted
   * @statusCodes [200, 201, 401, 404]
   */
  export const useAccept = (
    options?: AppMutationOptions<typeof InvitationsApi.accept, { token: string }> & InvalidateQueryOptions,
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
