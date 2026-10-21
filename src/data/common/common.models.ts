import { z } from "zod";

export namespace CommonModels {
  /**
   * UserEnumSchema
   * @type { enum }
   */
  export const UserEnumSchema = z.enum([
    "admin",
    "club_owner",
    "club_member",
    "club_coach",
    "free_member",
    "judge",
  ]);
  export type UserEnum = z.infer<typeof UserEnumSchema>;
  export const UserEnum = UserEnumSchema.enum;

  /**
   * BeltEnumSchema
   * @type { enum }
   * @description Maximum belt level (null = no upper limit),E,x,a,m,p,l,e,:, ,`,2,-,d,a,n,`
   */
  export const BeltEnumSchema = z.enum([
    "10-kyu",
    "9-kyu",
    "8-kyu",
    "7-kyu",
    "6-kyu",
    "5-kyu",
    "4-kyu",
    "3-kyu",
    "2-kyu",
    "1-kyu",
    "1-dan",
    "2-dan",
    "3-dan",
    "4-dan",
    "5-dan",
    "6-dan",
    "7-dan",
    "8-dan",
    "9-dan",
    "10-dan",
  ]);
  export type BeltEnum = z.infer<typeof BeltEnumSchema>;
  export const BeltEnum = BeltEnumSchema.enum;

  /**
   * ParticipantGenderEnumSchema
   * @type { enum }
   * @description Gender,E,x,a,m,p,l,e,:, ,`,m,a,l,e,`
   */
  export const ParticipantGenderEnumSchema = z.enum([
    "male",
    "female",
    "other",
  ]);
  export type ParticipantGenderEnum = z.infer<
    typeof ParticipantGenderEnumSchema
  >;
  export const ParticipantGenderEnum = ParticipantGenderEnumSchema.enum;

  /**
   * TournamentsFindAllStatusEnumSchema
   * @type { enum }
   * @description Tournament review and lifecycle status,E,x,a,m,p,l,e,:, ,`,a,p,p,r,o,v,e,d,`
   */
  export const TournamentsFindAllStatusEnumSchema = z.enum([
    "pending",
    "approved",
    "declined",
    "in_progress",
    "ended",
  ]);
  export type TournamentsFindAllStatusEnum = z.infer<
    typeof TournamentsFindAllStatusEnumSchema
  >;
  export const TournamentsFindAllStatusEnum =
    TournamentsFindAllStatusEnumSchema.enum;

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
   * DisciplineEnumSchema
   * @type { enum }
   * @description Discipline,E,x,a,m,p,l,e,:, ,`,y,a,k,o,-,s,o,k,u,-,k,u,m,i,t,e,`
   */
  export const DisciplineEnumSchema = z.enum([
    "kata",
    "kata-team",
    "kumite-team",
    "yako-soku-kumite",
    "yiju-kumite",
  ]);
  export type DisciplineEnum = z.infer<typeof DisciplineEnumSchema>;
  export const DisciplineEnum = DisciplineEnumSchema.enum;

  /**
   * SubDisciplineEnumSchema
   * @type { enum }
   * @description Sub-discipline (null = not specified),E,x,a,m,p,l,e,:, ,`,g,o,h,o,n,-,i,p,p,o,n,-,k,u,m,i,t,e,`
   */
  export const SubDisciplineEnumSchema = z.enum([
    "gohon-ippon-kumite",
    "sanbon-ippon-kumite",
    "kihon-ippon-kumite",
    "dyu-ippon-kumite",
  ]);
  export type SubDisciplineEnum = z.infer<typeof SubDisciplineEnumSchema>;
  export const SubDisciplineEnum = SubDisciplineEnumSchema.enum;

  /**
   * CategoryGenderEnumSchema
   * @type { enum }
   * @description Category gender (null = no gender restriction),E,x,a,m,p,l,e,:, ,`,m,a,l,e,`
   */
  export const CategoryGenderEnumSchema = z.enum(["male", "female"]);
  export type CategoryGenderEnum = z.infer<typeof CategoryGenderEnumSchema>;
  export const CategoryGenderEnum = CategoryGenderEnumSchema.enum;

  /**
   * ClubResponseDtoSchema
   * @type { object }
   * @property { string } id Club ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } name Club name. Example: `Tokyo Karate Club`
   * @property { string } address Club address. Example: `123 Main Street, Tokyo, Japan`
   * @property { string } country Club country. Example: `Japan`
   * @property { number } membersCount Number of members (users) in the club. Example: `42`
   * @property { string } createdAt Creation timestamp. Example: `2024-01-01T00:00:00.000Z`
   * @property { string } updatedAt Last update timestamp. Example: `2024-01-01T00:00:00.000Z`
   * @property { string } inviteUrl Invite URL for club owner (present only when club was created with ownerEmail). Example: `http://localhost:8000/invite/abc123`
   */
  export const ClubResponseDtoSchema = z.object({
    id: z.string(),
    name: z.string(),
    address: z.string().nullish(),
    country: z.string().nullish(),
    membersCount: z.number(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
    inviteUrl: z.string().nullish(),
  });
  export type ClubResponseDto = z.infer<typeof ClubResponseDtoSchema>;

  /**
   * UserResponseDtoSchema
   * @type { object }
   * @property { string } id User ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } auth0Id Auth0 user ID. Example: `auth0|123456789`
   * @property { string } clubId Club ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } firstName First name. Example: `John`
   * @property { string } lastName Last name. Example: `Doe`
   * @property { string } email Email (for display and future Auth0 linking). Example: `member@example.com`
   * @property { string } gender Gender. Example: `male`
   * @property { string } dateOfBirth Date of birth. Example: `1990-01-01T00:00:00.000Z`
   * @property { number } weight Weight in kg. Example: `75.5`
   * @property { string } beltLevel Belt level. Example: `1-dan`
   * @property { string[] } roles User roles. Example: `club_member`
   * @property { ClubResponseDto } club Club information
   * @property { string } createdAt Creation timestamp. Example: `2024-01-01T00:00:00.000Z`
   * @property { string } updatedAt Last update timestamp. Example: `2024-01-01T00:00:00.000Z`
   */
  export const UserResponseDtoSchema = z.object({
    id: z.string(),
    auth0Id: z.string(),
    clubId: z.string().nullish(),
    firstName: z.string().nullish(),
    lastName: z.string().nullish(),
    email: z.string().nullish(),
    gender: CommonModels.ParticipantGenderEnumSchema.nullish(),
    dateOfBirth: z.string().datetime({ offset: true }).nullish(),
    weight: z.number().nullish(),
    beltLevel: CommonModels.BeltEnumSchema.nullish(),
    roles: z.array(CommonModels.UserEnumSchema),
    club: CommonModels.ClubResponseDtoSchema.nullish(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  });
  export type UserResponseDto = z.infer<typeof UserResponseDtoSchema>;

  /**
   * TournamentFeeScheduleDtoSchema
   * @type { object }
   * @property { number } oneCategory Total fee when a participant is registered in 1 individual category. Example: `10`
   * @property { number } twoCategories Total fee when a participant is registered in 2 individual categories. Example: `20`
   * @property { number } threeOrMoreCategories Total fee when a participant is registered in 3 or more individual categories. Example: `30`
   * @property { number } team Fee charged once per team in a team category. Example: `30`
   */
  export const TournamentFeeScheduleDtoSchema = z.object({
    oneCategory: z.number().gte(0),
    twoCategories: z.number().gte(0),
    threeOrMoreCategories: z.number().gte(0),
    team: z.number().gte(0),
  });
  export type TournamentFeeScheduleDto = z.infer<
    typeof TournamentFeeScheduleDtoSchema
  >;

  /**
   * TournamentResponseDtoSchema
   * @type { object }
   * @property { string } id Tournament ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } name Tournament name. Example: `European Karate Championship 2024`
   * @property { string } location Tournament location. Example: `Paris, France`
   * @property { string } startDate Tournament start date and time. Example: `2024-06-15`
   * @property { string } registrationDeadline Registration deadline. Example: `2024-06-01`
   * @property { string } createdBy User ID who created the tournament. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { UserResponseDto } createdByUser User who created the tournament
   * @property { string } clubId Club ID assigned to the tournament. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { ClubResponseDto } club Club assigned to the tournament
   * @property { string[] } categoryIds Category IDs associated with this tournament. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } status Tournament review and lifecycle status. Example: `approved`
   * @property { string } reviewedAt When the tournament was last approved or declined. Example: `2024-01-15T12:00:00.000Z`
   * @property { string } reviewedBy Admin user ID who last approved or declined the tournament. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } reviewNote Note from decline or resubmit. Example: `Missing venue details`
   * @property { string } startedAt When the tournament was marked in progress. Example: `2024-06-15T09:00:00.000Z`
   * @property { string } startedBy User ID who marked the tournament in progress. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } endedAt When the tournament was marked ended. Example: `2024-06-16T18:00:00.000Z`
   * @property { string } endedBy User ID who marked the tournament ended. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { TournamentFeeScheduleDto } fees Registration fee schedule for this tournament
   * @property { string } createdAt Creation timestamp. Example: `2024-01-01T00:00:00.000Z`
   * @property { string } updatedAt Last update timestamp. Example: `2024-01-01T00:00:00.000Z`
   */
  export const TournamentResponseDtoSchema = z.object({
    id: z.string(),
    name: z.string(),
    location: z.string(),
    startDate: z.string(),
    registrationDeadline: z.string(),
    createdBy: z.string(),
    createdByUser: CommonModels.UserResponseDtoSchema.nullish(),
    clubId: z.string().nullish(),
    club: CommonModels.ClubResponseDtoSchema.nullish(),
    categoryIds: z.array(z.string()),
    status: CommonModels.TournamentsFindAllStatusEnumSchema,
    reviewedAt: z.string().datetime({ offset: true }).nullish(),
    reviewedBy: z.string().nullish(),
    reviewNote: z.string().nullish(),
    startedAt: z.string().datetime({ offset: true }).nullish(),
    startedBy: z.string().nullish(),
    endedAt: z.string().datetime({ offset: true }).nullish(),
    endedBy: z.string().nullish(),
    fees: CommonModels.TournamentFeeScheduleDtoSchema,
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  });
  export type TournamentResponseDto = z.infer<
    typeof TournamentResponseDtoSchema
  >;

  /**
   * CategoryResponseDtoSchema
   * @type { object }
   * @property { string } id Category ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } name Category name. Example: `Men Kumite -75kg`
   * @property { string } discipline Discipline. Example: `yako-soku-kumite`
   * @property { string } subDiscipline Sub-discipline (null = not specified). Example: `gohon-ippon-kumite`
   * @property { string } gender Category gender (null = no gender restriction). Example: `male`
   * @property { number } ageMin Minimum age in years (0 = no lower limit). Example: `18`
   * @property { number } ageMax Maximum age in years (0 = no upper limit). Example: `35`
   * @property { number } weightMin Minimum weight in kg (0 = no lower limit). Example: `70`
   * @property { number } weightMax Maximum weight in kg (0 = no upper limit). Example: `75`
   * @property { string } beltMin Minimum belt level (null = no lower limit). Example: `4-kyu`
   * @property { string } beltMax Maximum belt level (null = no upper limit). Example: `2-dan`
   * @property { number } teamSize Main team roster size (null = not applicable). Example: `3`
   * @property { number } teamReservesSize Number of reserve participants allowed (null = not applicable). Example: `1`
   * @property { string[] } feederCategoryIds Other category IDs that may supply limited feeder athletes. Empty when none are configured.. Example: ``
   * @property { number } feederParticipantLimit Maximum feeder-only athletes on one team roster (starters and reserves). Null or 0 = none. Using zero feeder athletes is always allowed.. Example: `1`
   * @property { string } clubId Owning club ID (null = global catalog). Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } createdAt Creation timestamp. Example: `2024-01-01T00:00:00.000Z`
   * @property { string } updatedAt Last update timestamp. Example: `2024-01-01T00:00:00.000Z`
   */
  export const CategoryResponseDtoSchema = z.object({
    id: z.string(),
    name: z.string(),
    discipline: CommonModels.DisciplineEnumSchema,
    subDiscipline: CommonModels.SubDisciplineEnumSchema.nullish(),
    gender: CommonModels.CategoryGenderEnumSchema.nullish(),
    ageMin: z.number().nullish(),
    ageMax: z.number().nullish(),
    weightMin: z.number().nullish(),
    weightMax: z.number().nullish(),
    beltMin: CommonModels.BeltEnumSchema.nullish(),
    beltMax: CommonModels.BeltEnumSchema.nullish(),
    teamSize: z.number().nullish(),
    teamReservesSize: z.number().nullish(),
    feederCategoryIds: z.array(z.string()),
    feederParticipantLimit: z.number().nullish(),
    clubId: z.string().nullish(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  });
  export type CategoryResponseDto = z.infer<typeof CategoryResponseDtoSchema>;

  /**
   * TournamentFeeParticipantDtoSchema
   * @type { object }
   * @property { string } userId Participant user ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } name Participant display name. Example: `Jane Doe`
   * @property { string } clubId Club ID from the participant’s individual registrations. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { number } categoryCount Number of individual (non-team) categories this participant is registered in. Example: `2`
   * @property { number } amount Individual category fee for this participant in euros. Example: `20`
   */
  export const TournamentFeeParticipantDtoSchema = z.object({
    userId: z.string(),
    name: z.string(),
    clubId: z.string().nullish(),
    categoryCount: z.number(),
    amount: z.number(),
  });
  export type TournamentFeeParticipantDto = z.infer<
    typeof TournamentFeeParticipantDtoSchema
  >;

  /**
   * TournamentFeeTeamLineDtoSchema
   * @type { object }
   * @property { string } teamId Team ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } categoryId Team category ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } categoryName Team category name. Example: `Kumite Team Senior`
   * @property { string } name Team display name. Example: `SKIF Ljubljana A`
   * @property { string } clubId Club ID on the team. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { number } amount Team fee in euros. Example: `30`
   */
  export const TournamentFeeTeamLineDtoSchema = z.object({
    teamId: z.string(),
    categoryId: z.string(),
    categoryName: z.string(),
    name: z.string(),
    clubId: z.string().nullish(),
    amount: z.number(),
  });
  export type TournamentFeeTeamLineDto = z.infer<
    typeof TournamentFeeTeamLineDtoSchema
  >;

  /**
   * TournamentFeeClubLineDtoSchema
   * @type { object }
   * @property { string } clubId Club ID. Null when registrations or teams have no club.. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { number } participantTotal Sum of individual participant fees for this club in euros. Example: `40`
   * @property { number } teamTotal Sum of team fees for this club in euros. Example: `30`
   * @property { number } total Participant and team fees combined in euros. Example: `70`
   */
  export const TournamentFeeClubLineDtoSchema = z.object({
    clubId: z.string().nullish(),
    participantTotal: z.number(),
    teamTotal: z.number(),
    total: z.number(),
  });
  export type TournamentFeeClubLineDto = z.infer<
    typeof TournamentFeeClubLineDtoSchema
  >;

  /**
   * TournamentFeesCalculationDtoSchema
   * @type { object }
   * @property { TournamentFeeScheduleDto } fees Fee schedule used for this calculation
   * @property { TournamentFeeParticipantDto[] } participants Individual participant fees. Team categories are excluded from the count.
   * @property { TournamentFeeTeamLineDto[] } teams Team fees. Each qualifying team is charged once.
   * @property { TournamentFeeClubLineDto[] } clubs Fees rolled up by club. Null clubId is kept as its own row.
   * @property { number } total Tournament (or user-scoped) total in euros. Example: `90`
   */
  export const TournamentFeesCalculationDtoSchema = z.object({
    fees: CommonModels.TournamentFeeScheduleDtoSchema,
    participants: z.array(CommonModels.TournamentFeeParticipantDtoSchema),
    teams: z.array(CommonModels.TournamentFeeTeamLineDtoSchema),
    clubs: z.array(CommonModels.TournamentFeeClubLineDtoSchema),
    total: z.number(),
  });
  export type TournamentFeesCalculationDto = z.infer<
    typeof TournamentFeesCalculationDtoSchema
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
}
