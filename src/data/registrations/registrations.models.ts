import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace RegistrationsModels {
  /**
   * RegistrationStatusEnumSchema
   * @type { enum }
   * @description Registration status,E,x,a,m,p,l,e,:, ,`,a,p,p,r,o,v,e,d,`
   */
  export const RegistrationStatusEnumSchema = z.enum([
    "pending",
    "approved",
    "rejected",
  ]);
  export type RegistrationStatusEnum = z.infer<
    typeof RegistrationStatusEnumSchema
  >;
  export const RegistrationStatusEnum = RegistrationStatusEnumSchema.enum;

  /**
   * TeamRoleEnumSchema
   * @type { enum }
   * @description Role on the first team roster,E,x,a,m,p,l,e,:, ,`,s,t,a,r,t,e,r,`
   */
  export const TeamRoleEnumSchema = z.enum(["starter", "reserve"]);
  export type TeamRoleEnum = z.infer<typeof TeamRoleEnumSchema>;
  export const TeamRoleEnum = TeamRoleEnumSchema.enum;

  /**
   * BulkParticipantRegistrationDtoSchema
   * @type { object }
   * @property { string } categoryId Category ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { number } finalWeight Final weight in kg. Example: `64.5`
   */
  export const BulkParticipantRegistrationDtoSchema = z.object({
    categoryId: z.string(),
    finalWeight: z.number().gte(0).optional(),
  });
  export type BulkParticipantRegistrationDto = z.infer<
    typeof BulkParticipantRegistrationDtoSchema
  >;

  /**
   * BulkParticipantDtoSchema
   * @type { object }
   * @property { string } firstName First name. Max Length: `100`. Example: `John`
   * @property { string } lastName Last name. Max Length: `100`. Example: `Doe`
   * @property { number } weight Weight in kg (omit/null when unknown; skipped for categories with no weight limits). Example: `65`
   * @property { string } dateOfBirth Date of birth. Example: `2018-02-02T00:00:00.000Z`
   * @property { string } gender Gender (required when matching categories with a gender restriction). Example: `male`
   * @property { string } beltLevel Belt level. Example: `10-kyu`
   * @property { BulkParticipantRegistrationDto[] } registrations Individual category registrations for this participant. May be empty when the person is only on teams.
   */
  export const BulkParticipantDtoSchema = z.object({
    firstName: z.string().max(100),
    lastName: z.string().max(100),
    weight: z.number().gte(0).nullish(),
    dateOfBirth: z.string().datetime({ offset: true }),
    gender: CommonModels.ParticipantGenderEnumSchema.optional(),
    beltLevel: CommonModels.BeltEnumSchema.optional(),
    registrations: z.array(BulkParticipantRegistrationDtoSchema).optional(),
  });
  export type BulkParticipantDto = z.infer<typeof BulkParticipantDtoSchema>;

  /**
   * BulkTeamDtoSchema
   * @type { object }
   * @property { string } categoryId Team category ID (must be a team discipline on the tournament). Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } name Team display name. Omit to generate from club name or starter last names.. Max Length: `255`. Example: `SKIF Ljubljana A`
   * @property { number[] } starters Participant indexes for starters (length must equal category teamSize). Min Items: `1`. Example: `0,1,2`
   * @property { number[] } reserves Participant indexes for reserves. Example: `3`
   */
  export const BulkTeamDtoSchema = z.object({
    categoryId: z.string(),
    name: z.string().max(255).optional(),
    starters: z.array(z.number().gte(0)).min(1),
    reserves: z.array(z.number().gte(0)).optional(),
  });
  export type BulkTeamDto = z.infer<typeof BulkTeamDtoSchema>;

  /**
   * BulkPublicRegistrationDtoSchema
   * @type { object }
   * @property { string } email Coach email address (used to find or create coach user). Example: `coach@club.com`
   * @property { string } firstName Coach first name. Max Length: `100`. Example: `Jane`
   * @property { string } lastName Coach last name. Max Length: `100`. Example: `Coach`
   * @property { string } clubName Club name (free text). If a matching club exists in the system, it is linked; otherwise registrations proceed without a club.. Min Length: `1`. Max Length: `255`. Example: `Dragon Karate Club`
   * @property { string } tournamentId Tournament ID for all registrations in this request. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { BulkParticipantDto[] } participants Participants to register. Min Items: `1`
   * @property { BulkTeamDto[] } teams Team rosters (kata-team / kumite-team / yako-soku-kumite). Participant indexes refer to participants[]. The same person may be on multiple teams; two teams in a category may not have the same set of people.
   */
  export const BulkPublicRegistrationDtoSchema = z.object({
    email: z.string().email(),
    firstName: z.string().max(100),
    lastName: z.string().max(100),
    clubName: z.string().min(1).max(255).optional(),
    tournamentId: z.string(),
    participants: z.array(BulkParticipantDtoSchema).min(1),
    teams: z.array(BulkTeamDtoSchema).optional(),
  });
  export type BulkPublicRegistrationDto = z.infer<
    typeof BulkPublicRegistrationDtoSchema
  >;

  /**
   * PublicParticipantProfileDtoSchema
   * @type { object }
   * @property { string } firstName First name. Max Length: `100`. Example: `John`
   * @property { string } lastName Last name. Max Length: `100`. Example: `Doe`
   * @property { number } weight Weight in kg (omit/null when unknown; skipped for categories with no weight limits). Example: `65`
   * @property { string } dateOfBirth Date of birth. Example: `2018-02-02T00:00:00.000Z`
   * @property { string } gender Gender (required when matching categories with a gender restriction). Example: `male`
   * @property { string } beltLevel Belt level. Example: `10-kyu`
   */
  export const PublicParticipantProfileDtoSchema = z.object({
    firstName: z.string().max(100),
    lastName: z.string().max(100),
    weight: z.number().gte(0).nullish(),
    dateOfBirth: z.string().datetime({ offset: true }),
    gender: CommonModels.ParticipantGenderEnumSchema.optional(),
    beltLevel: CommonModels.BeltEnumSchema.optional(),
  });
  export type PublicParticipantProfileDto = z.infer<
    typeof PublicParticipantProfileDtoSchema
  >;

  /**
   * BulkPublicSuitableCategoriesDtoSchema
   * @type { object }
   * @property { string } tournamentId Tournament ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { PublicParticipantProfileDto[] } participants Participants to evaluate for suitable categories. Min Items: `1`
   */
  export const BulkPublicSuitableCategoriesDtoSchema = z.object({
    tournamentId: z.string(),
    participants: z.array(PublicParticipantProfileDtoSchema).min(1),
  });
  export type BulkPublicSuitableCategoriesDto = z.infer<
    typeof BulkPublicSuitableCategoriesDtoSchema
  >;

  /**
   * PublicParticipantSuitableCategoriesItemDtoSchema
   * @type { object }
   * @property { string } firstName First name. Example: `Tok`
   * @property { string } lastName Last name. Example: `Pok`
   * @property { number } weight Weight in kg. Example: `50`
   * @property { string } dateOfBirth Date of birth. Example: `2012-05-19T00:00:00.000Z`
   * @property { string } gender Gender
   * @property { string } beltLevel Belt level
   * @property { CommonModels.CategoryResponseDto[] } categories Categories this participant is eligible for
   */
  export const PublicParticipantSuitableCategoriesItemDtoSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    weight: z.number().nullish(),
    dateOfBirth: z.string().datetime({ offset: true }),
    gender: CommonModels.ParticipantGenderEnumSchema.nullish(),
    beltLevel: CommonModels.BeltEnumSchema.nullish(),
    categories: z.array(CommonModels.CategoryResponseDtoSchema),
  });
  export type PublicParticipantSuitableCategoriesItemDto = z.infer<
    typeof PublicParticipantSuitableCategoriesItemDtoSchema
  >;

  /**
   * SuitableParticipantDtoSchema
   * @type { object }
   * @property { number } participantIndex Index in the request participants array (0-based)
   * @property { string } firstName First name. Example: `Tok`
   * @property { string } lastName Last name. Example: `Pok`
   * @property { number } weight Weight in kg. Example: `50`
   * @property { string } dateOfBirth Date of birth. Example: `2012-05-19T00:00:00.000Z`
   * @property { string } gender Gender
   * @property { string } beltLevel Belt level
   */
  export const SuitableParticipantDtoSchema = z.object({
    participantIndex: z.number().gte(0),
    firstName: z.string(),
    lastName: z.string(),
    weight: z.number().nullish(),
    dateOfBirth: z.string().datetime({ offset: true }),
    gender: CommonModels.ParticipantGenderEnumSchema.nullish(),
    beltLevel: CommonModels.BeltEnumSchema.nullish(),
  });
  export type SuitableParticipantDto = z.infer<
    typeof SuitableParticipantDtoSchema
  >;

  /**
   * CategorySuitableParticipantsItemDtoSchema
   * @type { object }
   * @property { CommonModels.CategoryResponseDto } category Tournament category
   * @property { SuitableParticipantDto[] } participants Participants eligible for this category (empty if none match)
   */
  export const CategorySuitableParticipantsItemDtoSchema = z.object({
    category: CommonModels.CategoryResponseDtoSchema,
    participants: z.array(SuitableParticipantDtoSchema),
  });
  export type CategorySuitableParticipantsItemDto = z.infer<
    typeof CategorySuitableParticipantsItemDtoSchema
  >;

  /**
   * RegistrationSubmissionParticipantDtoSchema
   * @type { object }
   * @property { string } id Participant user ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } firstName First name. Example: `John`
   * @property { string } lastName Last name. Example: `Doe`
   * @property { string } gender Gender. Example: `male`
   * @property { string } dateOfBirth Date of birth. Example: `2018-02-02T00:00:00.000Z`
   * @property { number } weight Weight in kg. Example: `65`
   * @property { string } beltLevel Belt level. Example: `10-kyu`
   * @property { CommonModels.CategoryResponseDto[] } categories Categories this participant was registered into on this submit
   */
  export const RegistrationSubmissionParticipantDtoSchema = z.object({
    id: z.string(),
    firstName: z.string().nullish(),
    lastName: z.string().nullish(),
    gender: CommonModels.ParticipantGenderEnumSchema.nullish(),
    dateOfBirth: z.string().datetime({ offset: true }).nullish(),
    weight: z.number().nullish(),
    beltLevel: CommonModels.BeltEnumSchema.nullish(),
    categories: z.array(CommonModels.CategoryResponseDtoSchema),
  });
  export type RegistrationSubmissionParticipantDto = z.infer<
    typeof RegistrationSubmissionParticipantDtoSchema
  >;

  /**
   * RegistrationSubmissionDetailsDtoSchema
   * @type { object }
   * @property { string } id Submission ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } tournamentId Tournament ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } email Contact email from the Club and contact form. Example: `coach@club.com`
   * @property { string } firstName Contact first name. Example: `Jane`
   * @property { string } lastName Contact last name. Example: `Coach`
   * @property { string } clubName Club name as typed on the form (kept even when no matching club exists). Example: `Test 123`
   * @property { string } clubId Resolved club ID when a matching club exists. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } registeredByUserId Coach / contact user ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } createdAt When this submit was created. Example: `2024-01-01T00:00:00.000Z`
   */
  export const RegistrationSubmissionDetailsDtoSchema = z.object({
    id: z.string(),
    tournamentId: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    clubName: z.string().nullish(),
    clubId: z.string().nullish(),
    registeredByUserId: z.string().nullish(),
    createdAt: z.string().datetime({ offset: true }),
  });
  export type RegistrationSubmissionDetailsDto = z.infer<
    typeof RegistrationSubmissionDetailsDtoSchema
  >;

  /**
   * RegistrationSubmissionResponseDtoSchema
   * @type { object }
   * @property { RegistrationSubmissionDetailsDto } details Club and contact details from this submit
   * @property { RegistrationSubmissionParticipantDto[] } participants Participants registered on this submit, each with their categories
   * @property { CommonModels.TournamentFeesCalculationDto } fees Fees due for pending and approved registrations on this submit
   */
  export const RegistrationSubmissionResponseDtoSchema = z.object({
    details: RegistrationSubmissionDetailsDtoSchema,
    participants: z.array(RegistrationSubmissionParticipantDtoSchema),
    fees: CommonModels.TournamentFeesCalculationDtoSchema,
  });
  export type RegistrationSubmissionResponseDto = z.infer<
    typeof RegistrationSubmissionResponseDtoSchema
  >;

  /**
   * RegistrationSubmissionGroupDtoSchema
   * @type { object }
   * @property { string } groupKey Stable key for this coach + club in the tournament. Example: `user-id|club:club-id`
   * @property { string } email Contact email from the latest submit in this group. Example: `coach@club.com`
   * @property { string } firstName Contact first name from the latest submit. Example: `Jane`
   * @property { string } lastName Contact last name from the latest submit. Example: `Coach`
   * @property { string } clubName Club name from the latest submit. Example: `SKIF Ljubljana`
   * @property { string } clubId Resolved club ID from the latest submit. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } registeredByUserId Coach / contact user ID from the latest submit. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { CommonModels.TournamentFeesCalculationDto } fees Fees due for pending and approved registrations across all submits in this group
   * @property { RegistrationSubmissionResponseDto[] } submissions Individual form sends in this group, oldest first, each with this-submit fees
   */
  export const RegistrationSubmissionGroupDtoSchema = z.object({
    groupKey: z.string(),
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    clubName: z.string().nullish(),
    clubId: z.string().nullish(),
    registeredByUserId: z.string().nullish(),
    fees: CommonModels.TournamentFeesCalculationDtoSchema,
    submissions: z.array(RegistrationSubmissionResponseDtoSchema),
  });
  export type RegistrationSubmissionGroupDto = z.infer<
    typeof RegistrationSubmissionGroupDtoSchema
  >;

  /**
   * TeamMembershipDtoSchema
   * @type { object }
   * @property { string } teamId Team ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } teamRole Role on this team roster. Example: `starter`
   * @property { string } teamName Team display name. Example: `SKIF Ljubljana A`
   */
  export const TeamMembershipDtoSchema = z.object({
    teamId: z.string(),
    teamRole: TeamRoleEnumSchema,
    teamName: z.string().nullish(),
  });
  export type TeamMembershipDto = z.infer<typeof TeamMembershipDtoSchema>;

  /**
   * RegistrationResponseDtoSchema
   * @type { object }
   * @property { string } id Registration ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } userId User ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } clubId Club ID (null when no club was linked). Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } tournamentId Tournament ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } categoryId Category ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } status Registration status. Example: `pending`
   * @property { number } finalWeight Final weight in kg. Example: `75.5`
   * @property { string } teamId First team ID when this registration is on one or more team rosters. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } teamRole Role on the first team roster. Example: `starter`
   * @property { TeamMembershipDto[] } teamMemberships All team roster memberships for this registration (a person may be on overlapping teams)
   * @property { CommonModels.UserResponseDto } user User information
   * @property { CommonModels.ClubResponseDto } club Club information
   * @property { string } createdAt Creation timestamp. Example: `2024-01-01T00:00:00.000Z`
   * @property { string } updatedAt Last update timestamp. Example: `2024-01-01T00:00:00.000Z`
   */
  export const RegistrationResponseDtoSchema = z.object({
    id: z.string(),
    userId: z.string(),
    clubId: z.string().nullish(),
    tournamentId: z.string(),
    categoryId: z.string(),
    status: RegistrationStatusEnumSchema,
    finalWeight: z.number().nullish(),
    teamId: z.string().nullish(),
    teamRole: TeamRoleEnumSchema.nullish(),
    teamMemberships: z.array(TeamMembershipDtoSchema).optional(),
    user: CommonModels.UserResponseDtoSchema.nullish(),
    club: CommonModels.ClubResponseDtoSchema.nullish(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  });
  export type RegistrationResponseDto = z.infer<
    typeof RegistrationResponseDtoSchema
  >;

  /**
   * BulkRegistrationResultItemDtoSchema
   * @type { object }
   * @property { number } participantIndex Index of the participant in the request array
   * @property { number } registrationIndex Index of the registration within the participant
   * @property { number } teamIndex Index of the team in the request teams array (present for team roster registrations)
   * @property { boolean } success Whether this registration was created successfully. Example: `true`
   * @property { RegistrationResponseDto } registration Created registration (present when success is true)
   * @property { string } error Error message (present when success is false). Example: `User belt level (white) is not within category range`
   */
  export const BulkRegistrationResultItemDtoSchema = z.object({
    participantIndex: z.number(),
    registrationIndex: z.number(),
    teamIndex: z.number().optional(),
    success: z.boolean(),
    registration: RegistrationResponseDtoSchema.optional(),
    error: z.string().optional(),
  });
  export type BulkRegistrationResultItemDto = z.infer<
    typeof BulkRegistrationResultItemDtoSchema
  >;

  /**
   * BulkPublicRegistrationResponseDtoSchema
   * @type { object }
   * @property { CommonModels.UserResponseDto } coach Coach user
   * @property { BulkRegistrationResultItemDto[] } results Per-registration results (partial success supported)
   */
  export const BulkPublicRegistrationResponseDtoSchema = z.object({
    coach: CommonModels.UserResponseDtoSchema,
    results: z.array(BulkRegistrationResultItemDtoSchema),
  });
  export type BulkPublicRegistrationResponseDto = z.infer<
    typeof BulkPublicRegistrationResponseDtoSchema
  >;

  /**
   * CreateRegistrationDtoSchema
   * @type { object }
   * @property { string } userId User ID (optional - defaults to authenticated user). Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } tournamentId Tournament ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } categoryId Category ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } clubId Club ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { number } finalWeight Final weight in kg. Example: `75.5`
   */
  export const CreateRegistrationDtoSchema = z.object({
    userId: z.string().optional(),
    tournamentId: z.string(),
    categoryId: z.string(),
    clubId: z.string(),
    finalWeight: z.number().gte(0).optional(),
  });
  export type CreateRegistrationDto = z.infer<
    typeof CreateRegistrationDtoSchema
  >;

  /**
   * CreateRegistrationWithUserDtoSchema
   * @type { object }
   * @property { string } email User email address (used to find or create user). Example: `john.doe@example.com`
   * @property { string } firstName First name. Max Length: `100`. Example: `John`
   * @property { string } lastName Last name. Max Length: `100`. Example: `Doe`
   * @property { number } weight Weight in kg. Example: `75.5`
   * @property { string } dateOfBirth Date of birth. Example: `2018-02-02T00:00:00.000Z`
   * @property { string } gender Gender. Example: `male`
   * @property { string } beltLevel Belt level. Example: `1-dan`
   * @property { string } tournamentId Tournament ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } categoryId Category ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } clubId Club ID (optional - can be set later). Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { number } finalWeight Final weight in kg. Example: `75.5`
   */
  export const CreateRegistrationWithUserDtoSchema = z.object({
    email: z.string().email(),
    firstName: z.string().max(100),
    lastName: z.string().max(100),
    weight: z.number().gte(0).optional(),
    dateOfBirth: z.string().datetime({ offset: true }),
    gender: CommonModels.ParticipantGenderEnumSchema.optional(),
    beltLevel: CommonModels.BeltEnumSchema.optional(),
    tournamentId: z.string(),
    categoryId: z.string(),
    clubId: z.string().optional(),
    finalWeight: z.number().gte(0).optional(),
  });
  export type CreateRegistrationWithUserDto = z.infer<
    typeof CreateRegistrationWithUserDtoSchema
  >;

  /**
   * TournamentRegistrationCountItemDtoSchema
   * @type { object }
   * @property { string } categoryId Assigned category ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { number } registrationCount Number of registrations in this category (including zero)
   */
  export const TournamentRegistrationCountItemDtoSchema = z.object({
    categoryId: z.string(),
    registrationCount: z.number(),
  });
  export type TournamentRegistrationCountItemDto = z.infer<
    typeof TournamentRegistrationCountItemDtoSchema
  >;

  /**
   * UpdateRegistrationDtoSchema
   * @type { object }
   * @property { string } categoryId Category ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { number } finalWeight Final weight in kg. Example: `75.5`
   * @property { string } status Registration status. Example: `approved`
   */
  export const UpdateRegistrationDtoSchema = z
    .object({
      categoryId: z.string(),
      finalWeight: z.number().gte(0),
      status: RegistrationStatusEnumSchema,
    })
    .partial();
  export type UpdateRegistrationDto = z.infer<
    typeof UpdateRegistrationDtoSchema
  >;

  /**
   * GetPublicSuitableCategoriesBeltLevelParamSchema
   * @type { string }
   * @description E,x,a,m,p,l,e,:, ,`,7,-,k,y,u,`
   */
  export const GetPublicSuitableCategoriesBeltLevelParamSchema =
    CommonModels.BeltEnumSchema;
  export type GetPublicSuitableCategoriesBeltLevelParam = z.infer<
    typeof GetPublicSuitableCategoriesBeltLevelParamSchema
  >;

  /**
   * GetPublicSuitableCategoriesGenderParamSchema
   * @type { string }
   * @description E,x,a,m,p,l,e,:, ,`,m,a,l,e,`
   */
  export const GetPublicSuitableCategoriesGenderParamSchema =
    CommonModels.ParticipantGenderEnumSchema.optional();
  export type GetPublicSuitableCategoriesGenderParam = z.infer<
    typeof GetPublicSuitableCategoriesGenderParamSchema
  >;

  /**
   * GetPublicSuitableCategoriesResponseSchema
   * @type { array }
   */
  export const GetPublicSuitableCategoriesResponseSchema = z.array(
    CommonModels.CategoryResponseDtoSchema,
  );
  export type GetPublicSuitableCategoriesResponse = z.infer<
    typeof GetPublicSuitableCategoriesResponseSchema
  >;

  /**
   * GetBulkPublicSuitableCategoriesResponseSchema
   * @type { array }
   */
  export const GetBulkPublicSuitableCategoriesResponseSchema = z.array(
    PublicParticipantSuitableCategoriesItemDtoSchema,
  );
  export type GetBulkPublicSuitableCategoriesResponse = z.infer<
    typeof GetBulkPublicSuitableCategoriesResponseSchema
  >;

  /**
   * GetSuitableParticipantsByCategoryResponseSchema
   * @type { array }
   */
  export const GetSuitableParticipantsByCategoryResponseSchema = z.array(
    CategorySuitableParticipantsItemDtoSchema,
  );
  export type GetSuitableParticipantsByCategoryResponse = z.infer<
    typeof GetSuitableParticipantsByCategoryResponseSchema
  >;

  /**
   * FindCountsByTournamentResponseSchema
   * @type { array }
   */
  export const FindCountsByTournamentResponseSchema = z.array(
    TournamentRegistrationCountItemDtoSchema,
  );
  export type FindCountsByTournamentResponse = z.infer<
    typeof FindCountsByTournamentResponseSchema
  >;

  /**
   * FindSubmissionsByTournamentResponseSchema
   * @type { array }
   */
  export const FindSubmissionsByTournamentResponseSchema = z.array(
    RegistrationSubmissionGroupDtoSchema,
  );
  export type FindSubmissionsByTournamentResponse = z.infer<
    typeof FindSubmissionsByTournamentResponseSchema
  >;

  /**
   * FindByTournamentResponseSchema
   * @type { array }
   */
  export const FindByTournamentResponseSchema = z.array(
    RegistrationResponseDtoSchema,
  );
  export type FindByTournamentResponse = z.infer<
    typeof FindByTournamentResponseSchema
  >;

  /**
   * FindByUserStatusParamSchema
   * @type { string }
   * @description E,x,a,m,p,l,e,:, ,`,p,e,n,d,i,n,g,`
   */
  export const FindByUserStatusParamSchema =
    RegistrationStatusEnumSchema.optional();
  export type FindByUserStatusParam = z.infer<
    typeof FindByUserStatusParamSchema
  >;

  /**
   * FindByUserResponseSchema
   * @type { array }
   */
  export const FindByUserResponseSchema = z.array(
    RegistrationResponseDtoSchema,
  );
  export type FindByUserResponse = z.infer<typeof FindByUserResponseSchema>;

  /**
   * GetSuitableCategoriesResponseSchema
   * @type { array }
   */
  export const GetSuitableCategoriesResponseSchema = z.array(
    CommonModels.CategoryResponseDtoSchema,
  );
  export type GetSuitableCategoriesResponse = z.infer<
    typeof GetSuitableCategoriesResponseSchema
  >;

  /**
   * FindMineStatusParamSchema
   * @type { string }
   * @description E,x,a,m,p,l,e,:, ,`,p,e,n,d,i,n,g,`
   */
  export const FindMineStatusParamSchema =
    RegistrationStatusEnumSchema.optional();
  export type FindMineStatusParam = z.infer<typeof FindMineStatusParamSchema>;

  /**
   * FindMineResponseSchema
   * @type { array }
   */
  export const FindMineResponseSchema = z.array(RegistrationResponseDtoSchema);
  export type FindMineResponse = z.infer<typeof FindMineResponseSchema>;
}
