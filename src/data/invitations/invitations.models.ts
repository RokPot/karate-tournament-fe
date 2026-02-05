import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace InvitationsModels {
  /**
   * InvitationStatusEnumSchema
   * @type { enum }
   * @description Invitation status,E,x,a,m,p,l,e,:, ,`,p,e,n,d,i,n,g,`
   */
  export const InvitationStatusEnumSchema = z.enum([
    "pending",
    "accepted",
    "expired",
    "cancelled",
  ]);
  export type InvitationStatusEnum = z.infer<typeof InvitationStatusEnumSchema>;
  export const InvitationStatusEnum = InvitationStatusEnumSchema.enum;

  /**
   * AcceptInvitationResponseDtoSchema
   * @type { object }
   * @property { CommonModels.UserResponseDto } user Updated user (linked to club with owner role)
   * @property { CommonModels.ClubResponseDto } club Club the user was linked to
   */
  export const AcceptInvitationResponseDtoSchema = z.object({
    user: CommonModels.UserResponseDtoSchema,
    club: CommonModels.ClubResponseDtoSchema,
  });
  export type AcceptInvitationResponseDto = z.infer<
    typeof AcceptInvitationResponseDtoSchema
  >;

  /**
   * InvitationListItemDtoSchema
   * @type { object }
   * @property { string } id Invitation ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } clubId Club ID. Example: `123e4567-e89b-12d3-a456-426614174001`
   * @property { string } clubName Club name the user is invited to join. Example: `Tokyo Karate Club`
   * @property { string } token Invitation token; use to build invite link (e.g. /invite/:token). Example: `abc12345-e89b-12d3-a456-426614174000`
   * @property { string } email Invitee email. Example: `owner@example.com`
   * @property { string } firstName Invitee first name. Example: `Jane`
   * @property { string } lastName Invitee last name. Example: `Doe`
   * @property { string } status Invitation status. Example: `pending`
   * @property { string } createdAt When the invitation was created. Example: `2024-02-01T12:00:00.000Z`
   * @property { string } expiresAt Invitation expiry timestamp. Example: `2024-02-08T12:00:00.000Z`
   * @property { string } acceptedAt When the invitation was accepted (if accepted). Example: `2024-02-05T14:00:00.000Z`
   */
  export const InvitationListItemDtoSchema = z.object({
    id: z.string(),
    clubId: z.string(),
    clubName: z.string(),
    token: z.string(),
    email: z.string(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    status: InvitationStatusEnumSchema,
    createdAt: z.string().datetime({ offset: true }),
    expiresAt: z.string().datetime({ offset: true }),
    acceptedAt: z.string().datetime({ offset: true }).nullish(),
  });
  export type InvitationListItemDto = z.infer<
    typeof InvitationListItemDtoSchema
  >;

  /**
   * InvitationByTokenResponseDtoSchema
   * @type { object }
   * @property { string } clubName Club name the user is invited to join. Example: `Tokyo Karate Club`
   * @property { string } expiresAt Invitation expiry timestamp. Example: `2024-02-08T12:00:00.000Z`
   * @property { string } status Invitation status. Example: `pending`
   */
  export const InvitationByTokenResponseDtoSchema = z.object({
    clubName: z.string(),
    expiresAt: z.string().datetime({ offset: true }),
    status: InvitationStatusEnumSchema,
  });
  export type InvitationByTokenResponseDto = z.infer<
    typeof InvitationByTokenResponseDtoSchema
  >;

  /**
   * InvitationsFindAllResponseSchema
   * @type { array }
   */
  export const InvitationsFindAllResponseSchema = z.array(
    InvitationListItemDtoSchema,
  );
  export type InvitationsFindAllResponse = z.infer<
    typeof InvitationsFindAllResponseSchema
  >;
}
