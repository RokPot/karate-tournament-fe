import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace ClubsModels {
  /**
   * AddMemberRoleEnumSchema
   * @type { enum }
   * @description Role to assign to the member,E,x,a,m,p,l,e,:, ,`,c,l,u,b,_,m,e,m,b,e,r,`
   */
  export const AddMemberRoleEnumSchema = z.enum([
    "club_owner",
    "club_member",
    "club_coach",
  ]);
  export type AddMemberRoleEnum = z.infer<typeof AddMemberRoleEnumSchema>;
  export const AddMemberRoleEnum = AddMemberRoleEnumSchema.enum;

  /**
   * CreateClubInvitationRoleEnumSchema
   * @type { enum }
   * @description Role to assign on accept. Defaults to club_member.,E,x,a,m,p,l,e,:, ,`,c,l,u,b,_,m,e,m,b,e,r,`
   */
  export const CreateClubInvitationRoleEnumSchema = z.enum([
    "club_owner",
    "club_coach",
    "club_member",
  ]);
  export type CreateClubInvitationRoleEnum = z.infer<
    typeof CreateClubInvitationRoleEnumSchema
  >;
  export const CreateClubInvitationRoleEnum =
    CreateClubInvitationRoleEnumSchema.enum;

  /**
   * CreateClubDtoSchema
   * @type { object }
   * @property { string } name Club name. Max Length: `255`. Example: `Tokyo Karate Club`
   * @property { string } address Club address. Max Length: `500`. Example: `123 Main Street, Tokyo, Japan`
   * @property { string } country Club country. Max Length: `100`. Example: `Japan`
   * @property { string } ownerEmail Club owner email; when provided, an invitation is created and inviteUrl returned. Max Length: `255`. Example: `owner@example.com`
   * @property { string } ownerFirstName Club owner first name. Max Length: `100`. Example: `John`
   * @property { string } ownerLastName Club owner last name. Max Length: `100`. Example: `Doe`
   */
  export const CreateClubDtoSchema = z.object({
    name: z.string().max(255),
    address: z.string().max(500).optional(),
    country: z.string().max(100).optional(),
    ownerEmail: z.string().max(255).email().optional(),
    ownerFirstName: z.string().max(100).optional(),
    ownerLastName: z.string().max(100).optional(),
  });
  export type CreateClubDto = z.infer<typeof CreateClubDtoSchema>;

  /**
   * AddMemberDtoSchema
   * @type { object }
   * @property { string } role Role to assign to the member. Example: `club_member`
   * @property { string } firstName First name. Min Length: `2`. Max Length: `100`. Example: `John`
   * @property { string } lastName Last name. Min Length: `2`. Max Length: `100`. Example: `Doe`
   * @property { string } email Email (for display and future Auth0 linking). Max Length: `255`. Example: `member@example.com`
   * @property { string } gender Gender. Example: `male`
   * @property { string } dateOfBirth Date of birth. Example: `7.7.2000`
   * @property { number } weight Weight in kg. Maximum: `999.99`. Example: `75.5`
   * @property { string } beltLevel Belt level. Example: `1-dan`
   */
  export const AddMemberDtoSchema = z.object({
    role: AddMemberRoleEnumSchema,
    firstName: z.string().min(2).max(100),
    lastName: z.string().min(2).max(100),
    email: z.string().max(255).email().optional(),
    gender: CommonModels.ParticipantGenderEnumSchema,
    dateOfBirth: z.string(),
    weight: z.number().gte(0).lte(999.99).optional(),
    beltLevel: CommonModels.BeltEnumSchema,
  });
  export type AddMemberDto = z.infer<typeof AddMemberDtoSchema>;

  /**
   * CreateClubInvitationDtoSchema
   * @type { object }
   * @property { string } email Invitee email. Max Length: `255`. Example: `member@example.com`
   * @property { string } firstName Invitee first name. Max Length: `100`. Example: `Jane`
   * @property { string } lastName Invitee last name. Max Length: `100`. Example: `Doe`
   * @property { string } role Role to assign on accept. Defaults to club_member.. Example: `club_member`
   */
  export const CreateClubInvitationDtoSchema = z.object({
    email: z.string().max(255).email(),
    firstName: z.string().max(100).optional(),
    lastName: z.string().max(100).optional(),
    role: CreateClubInvitationRoleEnumSchema.optional(),
  });
  export type CreateClubInvitationDto = z.infer<
    typeof CreateClubInvitationDtoSchema
  >;

  /**
   * InvitationCreatedResponseDtoSchema
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
   * @property { string } inviteUrl Invite URL for the invitee. Example: `http://localhost:8000/invite/abc123`
   */
  export const InvitationCreatedResponseDtoSchema = z.object({
    id: z.string(),
    clubId: z.string(),
    clubName: z.string(),
    token: z.string(),
    email: z.string(),
    firstName: z.string().nullable(),
    lastName: z.string().nullable(),
    status: CommonModels.InvitationStatusEnumSchema,
    createdAt: z.string().datetime({ offset: true }),
    expiresAt: z.string().datetime({ offset: true }),
    acceptedAt: z.string().datetime({ offset: true }).nullish(),
    inviteUrl: z.string(),
  });
  export type InvitationCreatedResponseDto = z.infer<
    typeof InvitationCreatedResponseDtoSchema
  >;

  /**
   * UpdateClubDtoSchema
   * @type { object }
   * @property { string } name Club name. Max Length: `255`. Example: `Tokyo Karate Club`
   * @property { string } address Club address. Max Length: `500`. Example: `123 Main Street, Tokyo, Japan`
   * @property { string } country Club country. Max Length: `100`. Example: `Japan`
   */
  export const UpdateClubDtoSchema = z
    .object({
      name: z.string().max(255),
      address: z.string().max(500),
      country: z.string().max(100),
    })
    .partial();
  export type UpdateClubDto = z.infer<typeof UpdateClubDtoSchema>;

  /**
   * ClubsFindAllResponseSchema
   * @type { array }
   */
  export const ClubsFindAllResponseSchema = z.array(
    CommonModels.ClubResponseDtoSchema,
  );
  export type ClubsFindAllResponse = z.infer<typeof ClubsFindAllResponseSchema>;

  /**
   * GetMembersRoleParamSchema
   * @type { string }
   */
  export const GetMembersRoleParamSchema =
    CommonModels.UserEnumSchema.optional();
  export type GetMembersRoleParam = z.infer<typeof GetMembersRoleParamSchema>;

  /**
   * GetMembersResponseSchema
   * @type { array }
   */
  export const GetMembersResponseSchema = z.array(
    CommonModels.UserResponseDtoSchema,
  );
  export type GetMembersResponse = z.infer<typeof GetMembersResponseSchema>;

  /**
   * GetTournamentsResponseSchema
   * @type { array }
   */
  export const GetTournamentsResponseSchema = z.array(
    CommonModels.TournamentResponseDtoSchema,
  );
  export type GetTournamentsResponse = z.infer<
    typeof GetTournamentsResponseSchema
  >;
}
