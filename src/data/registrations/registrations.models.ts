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
   * @property { string } userId Existing participant user ID (continue-roster PUT). Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { BulkParticipantRegistrationDto[] } registrations Individual category registrations for this participant. May be empty when the person is only on teams.
   */
  export const BulkParticipantDtoSchema = z.object({
    firstName: z.string().max(100),
    lastName: z.string().max(100),
    weight: z.number().gte(0).nullish(),
    dateOfBirth: z.string().datetime({ offset: true }),
    gender: CommonModels.ParticipantGenderEnumSchema.optional(),
    beltLevel: CommonModels.BeltEnumSchema.optional(),
    userId: z.string().optional(),
    registrations: z.array(BulkParticipantRegistrationDtoSchema).optional(),
  });
  export type BulkParticipantDto = z.infer<typeof BulkParticipantDtoSchema>;

  /**
   * BulkTeamDtoSchema
   * @type { object }
   * @property { string } categoryId Team category ID (must be a team discipline on the tournament). Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } id Existing team ID (continue-roster PUT). Omit to create a new team.. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } name Team display name. Omit to generate from club name or starter last names.. Max Length: `255`. Example: `SKIF Ljubljana A`
   * @property { number[] } starters Participant indexes for starters (length must equal category teamSize). Min Items: `1`. Example: `0,1,2`
   * @property { number[] } reserves Participant indexes for reserves. Example: `3`
   */
  export const BulkTeamDtoSchema = z.object({
    categoryId: z.string(),
    id: z.string().optional(),
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
   * @property { SuitableParticipantDto[] } otherEligibleParticipants Participants who do not fit this category but fit a configured feeder category. Empty unless this is a team category with feeder categories and a positive feederParticipantLimit. Not required on the roster.
   */
  export const CategorySuitableParticipantsItemDtoSchema = z.object({
    category: CommonModels.CategoryResponseDtoSchema,
    participants: z.array(SuitableParticipantDtoSchema),
    otherEligibleParticipants: z.array(SuitableParticipantDtoSchema),
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
   * RosterRegistrationItemDtoSchema
   * @type { object }
   * @property { string } id Registration ID
   * @property { string } categoryId Category ID
   */
  export const RosterRegistrationItemDtoSchema = z.object({
    id: z.string(),
    categoryId: z.string(),
  });
  export type RosterRegistrationItemDto = z.infer<
    typeof RosterRegistrationItemDtoSchema
  >;

  /**
   * RosterParticipantDtoSchema
   * @type { object }
   * @property { string } userId Participant user ID
   * @property { string } firstName First name
   * @property { string } lastName Last name
   * @property { number } weight Weight in kg
   * @property { string } dateOfBirth Date of birth. Example: `2024-01-01T00:00:00.000Z`
   * @property { string } gender
   * @property { string } beltLevel
   * @property { RosterRegistrationItemDto[] } registrations Individual (non-team) category registrations
   */
  export const RosterParticipantDtoSchema = z.object({
    userId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    weight: z.number().nullish(),
    dateOfBirth: z.string().datetime({ offset: true }),
    gender: CommonModels.ParticipantGenderEnumSchema.nullish(),
    beltLevel: CommonModels.BeltEnumSchema.nullish(),
    registrations: z.array(RosterRegistrationItemDtoSchema),
  });
  export type RosterParticipantDto = z.infer<typeof RosterParticipantDtoSchema>;

  /**
   * RosterTeamItemDtoSchema
   * @type { object }
   * @property { string } id Team ID
   * @property { string } name Team display name
   * @property { string } categoryId Team category ID
   * @property { number[] } starters Starter indexes into participants[]
   * @property { number[] } reserves Reserve indexes into participants[]
   */
  export const RosterTeamItemDtoSchema = z.object({
    id: z.string(),
    name: z.string(),
    categoryId: z.string(),
    starters: z.array(z.number()),
    reserves: z.array(z.number()).optional(),
  });
  export type RosterTeamItemDto = z.infer<typeof RosterTeamItemDtoSchema>;

  /**
   * RosterResponseDtoSchema
   * @type { object }
   * @property { string } email Coach email
   * @property { string } firstName Coach first name
   * @property { string } lastName Coach last name
   * @property { string } clubName
   * @property { string } clubId
   * @property { string } tournamentId Tournament ID
   * @property { string } updatedAt When the roster was last saved. Example: `2024-01-01T00:00:00.000Z`
   * @property { RosterParticipantDto[] } participants
   * @property { RosterTeamItemDto[] } teams
   * @property { CommonModels.TournamentFeesCalculationDto } fees Current bill for this roster
   */
  export const RosterResponseDtoSchema = z.object({
    email: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    clubName: z.string().nullish(),
    clubId: z.string().nullish(),
    tournamentId: z.string(),
    updatedAt: z.string().datetime({ offset: true }),
    participants: z.array(RosterParticipantDtoSchema),
    teams: z.array(RosterTeamItemDtoSchema),
    fees: CommonModels.TournamentFeesCalculationDtoSchema.optional(),
  });
  export type RosterResponseDto = z.infer<typeof RosterResponseDtoSchema>;

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
   * RosterPutDtoSchema
   * @type { object }
   * @property { string } email Coach email address (used to find or create coach user). Example: `coach@club.com`
   * @property { string } firstName Coach first name. Max Length: `100`. Example: `Jane`
   * @property { string } lastName Coach last name. Max Length: `100`. Example: `Coach`
   * @property { string } clubName Club name (free text). If a matching club exists in the system, it is linked; otherwise registrations proceed without a club.. Min Length: `1`. Max Length: `255`. Example: `Dragon Karate Club`
   * @property { string } tournamentId Tournament ID for all registrations in this request. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { BulkParticipantDto[] } participants Participants to register. Min Items: `1`
   * @property { BulkTeamDto[] } teams Team rosters (kata-team / kumite-team / yako-soku-kumite). Participant indexes refer to participants[]. The same person may be on multiple teams; two teams in a category may not have the same set of people.
   * @property { string } accessToken Access token from OTP verify. Min Length: `16`
   * @property { string } updatedAt Roster updatedAt from GET; must match or the request is rejected with 409. Example: `2024-01-01T00:00:00.000Z`
   */
  export const RosterPutDtoSchema = z.object({
    email: z.string().email(),
    firstName: z.string().max(100),
    lastName: z.string().max(100),
    clubName: z.string().min(1).max(255).optional(),
    tournamentId: z.string(),
    participants: z.array(BulkParticipantDtoSchema).min(1),
    teams: z.array(BulkTeamDtoSchema).optional(),
    accessToken: z.string().min(16),
    updatedAt: z.string().datetime({ offset: true }),
  });
  export type RosterPutDto = z.infer<typeof RosterPutDtoSchema>;

  /**
   * RosterLookupResponseDtoSchema
   * @type { object }
   * @property { boolean } found Whether a roster exists for this coach + club in the tournament
   * @property { string } updatedAt When the roster was last saved (present when found is true). Example: `2024-01-01T00:00:00.000Z`
   */
  export const RosterLookupResponseDtoSchema = z.object({
    found: z.boolean(),
    updatedAt: z.string().datetime({ offset: true }).nullish(),
  });
  export type RosterLookupResponseDto = z.infer<
    typeof RosterLookupResponseDtoSchema
  >;

  /**
   * RosterOtpResponseDtoSchema
   * @type { object }
   * @property { string } debugCode Present only when mail is disabled outside production, for local continue testing. Example: `123456`
   */
  export const RosterOtpResponseDtoSchema = z
    .object({ debugCode: z.string() })
    .partial();
  export type RosterOtpResponseDto = z.infer<typeof RosterOtpResponseDtoSchema>;

  /**
   * RosterOtpVerifyResponseDtoSchema
   * @type { object }
   * @property { string } accessToken Short-lived access token for GET/PUT current roster
   * @property { string } expiresAt When this access token expires. Example: `2024-01-01T00:00:00.000Z`
   * @property { string } updatedAt Roster updatedAt for later PUT If-Match. Example: `2024-01-01T00:00:00.000Z`
   */
  export const RosterOtpVerifyResponseDtoSchema = z.object({
    accessToken: z.string(),
    expiresAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  });
  export type RosterOtpVerifyResponseDto = z.infer<
    typeof RosterOtpVerifyResponseDtoSchema
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
   * CreateStaffRegistrationDtoSchema
   * @type { object }
   * @property { string } tournamentId Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } categoryId Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } firstName Max Length: `100`. Example: `John`
   * @property { string } lastName Max Length: `100`. Example: `Doe`
   * @property { string } gender Example: `male`
   * @property { string } dateOfBirth Date of birth. Example: `2018-02-02T00:00:00.000Z`
   * @property { string } beltLevel Example: `1-dan`
   * @property { number } weight Weight in kg. Example: `75.5`
   * @property { number } finalWeight Final (weigh-in) weight in kg. Example: `75.5`
   * @property { string } clubId Participant club. Part of the participant identity when no email is given.. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } email When set, the user with this email is found or created. Otherwise club + name + date of birth identify the person.. Example: `john.doe@example.com`
   */
  export const CreateStaffRegistrationDtoSchema = z.object({
    tournamentId: z.string(),
    categoryId: z.string(),
    firstName: z.string().max(100),
    lastName: z.string().max(100),
    gender: CommonModels.ParticipantGenderEnumSchema,
    dateOfBirth: z.string().datetime({ offset: true }),
    beltLevel: CommonModels.BeltEnumSchema,
    weight: z.number().gte(0).optional(),
    finalWeight: z.number().gte(0).optional(),
    clubId: z.string().optional(),
    email: z.string().email().optional(),
  });
  export type CreateStaffRegistrationDto = z.infer<
    typeof CreateStaffRegistrationDtoSchema
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
   * RosterIdentityDtoSchema
   * @type { object }
   * @property { string } tournamentId Tournament ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } email Coach email. Example: `coach@club.com`
   * @property { string } clubName Club name as typed on the form. Min Length: `1`. Max Length: `255`. Example: `SKIF Ljubljana`
   */
  export const RosterIdentityDtoSchema = z.object({
    tournamentId: z.string(),
    email: z.string().email(),
    clubName: z.string().min(1).max(255).optional(),
  });
  export type RosterIdentityDto = z.infer<typeof RosterIdentityDtoSchema>;

  /**
   * RosterOtpRequestDtoSchema
   * @type { object }
   * @property { string } tournamentId Tournament ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } email Coach email. Example: `coach@club.com`
   * @property { string } clubName Club name as typed on the form. Min Length: `1`. Max Length: `255`. Example: `SKIF Ljubljana`
   */
  export const RosterOtpRequestDtoSchema = z.object({
    tournamentId: z.string(),
    email: z.string().email(),
    clubName: z.string().min(1).max(255).optional(),
  });
  export type RosterOtpRequestDto = z.infer<typeof RosterOtpRequestDtoSchema>;

  /**
   * RosterOtpVerifyDtoSchema
   * @type { object }
   * @property { string } tournamentId Tournament ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } email Coach email. Example: `coach@club.com`
   * @property { string } clubName Club name as typed on the form. Min Length: `1`. Max Length: `255`. Example: `SKIF Ljubljana`
   * @property { string } code 6-digit code from email. Min Length: `6`. Max Length: `6`. Example: `123456`
   */
  export const RosterOtpVerifyDtoSchema = z.object({
    tournamentId: z.string(),
    email: z.string().email(),
    clubName: z.string().min(1).max(255).optional(),
    code: z
      .string()
      .min(6)
      .max(6)
      .regex(/^\d{6}$/),
  });
  export type RosterOtpVerifyDto = z.infer<typeof RosterOtpVerifyDtoSchema>;

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
   * UpdateRegistrationIdentityDtoSchema
   * @type { object }
   * @property { string } firstName Max Length: `100`. Example: `John`
   * @property { string } lastName Max Length: `100`. Example: `Doe`
   * @property { string } gender Example: `male`
   * @property { string } dateOfBirth Date of birth. Example: `2018-02-02T00:00:00.000Z`
   * @property { number } weight Weight in kg. Example: `75.5`
   * @property { string } beltLevel Example: `1-dan`
   * @property { number } finalWeight Final (weigh-in) weight in kg for this registration. Example: `75.5`
   */
  export const UpdateRegistrationIdentityDtoSchema = z
    .object({
      firstName: z.string().max(100),
      lastName: z.string().max(100),
      gender: CommonModels.ParticipantGenderEnumSchema,
      dateOfBirth: z.string().datetime({ offset: true }),
      weight: z.number().gte(0),
      beltLevel: CommonModels.BeltEnumSchema,
      finalWeight: z.number().gte(0),
    })
    .partial();
  export type UpdateRegistrationIdentityDto = z.infer<
    typeof UpdateRegistrationIdentityDtoSchema
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
