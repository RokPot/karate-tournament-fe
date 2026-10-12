import { z } from "zod";

import { CommonModels } from "@/data/common/common.models";
import { AppRestClient } from "@/util/rest/clients/app-rest-client";

import { InvitationsModels } from "./invitations.models";

export namespace InvitationsApi {
  export const findAll = (clubId?: string) => {
    return AppRestClient.get({ resSchema: InvitationsModels.InvitationsFindAllResponseSchema }, `/invitations`, {
      params: {
        clubId,
      },
    });
  };

  export const cancel = (id: string) => {
    return AppRestClient.delete({ resSchema: z.void() }, `/invitations/${id}`);
  };

  export const resend = (id: string) => {
    return AppRestClient.post(
      { resSchema: CommonModels.InvitationCreatedResponseDtoSchema },
      `/invitations/${id}/resend`,
    );
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
