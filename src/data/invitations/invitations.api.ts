import { AppRestClient } from "@/util/rest/clients/app-rest-client";

import { InvitationsModels } from "./invitations.models";

export namespace InvitationsApi {
  export const findAll = () => {
    return AppRestClient.get({ resSchema: InvitationsModels.InvitationsFindAllResponseSchema }, `/invitations`);
  };

  export const getByToken = (token: string) => {
    return AppRestClient.get(
      { resSchema: InvitationsModels.InvitationByTokenResponseDtoSchema },
      `/invitations/by-token/${token}`,
    );
  };

  export const accept = (token: string) => {
    return AppRestClient.post(
      { resSchema: InvitationsModels.AcceptInvitationResponseDtoSchema },
      `/invitations/${token}/accept`,
    );
  };
}
