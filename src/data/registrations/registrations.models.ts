import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace RegistrationsModels {
  /**
   * RegistrationStatusEnumSchema
   * @type { enum }
   * @description Registration status,E,x,a,m,p,l,e,:, ,`,p,e,n,d,i,n,g,`
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
   * @description Role on the team roster,E,x,a,m,p,l,e,:, ,`,s,t,a,r,t,e,r,`
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
   * @property { number } weight Weight in kg. Example: `65`
   * @property { string } dateOfBirth Date of birth. Example: `2018-02-02T00:00:00.000Z`
   * @property { string } gender Gender (required when matching categories with a gender restriction). Example: `male`
   * @property { string } beltLevel Belt level. Example: `10-kyu`
   * @property { BulkParticipantRegistrationDto[] } registrations Individual category registrations for this participant. May be empty when the person is only on teams.
   */
  export const BulkParticipantDtoSchema = z.object({
    firstName: z.string().max(100),
    lastName: z.string().max(100),
    weight: z.number().gte(0),
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
   * @property { number[] } starters Participant indexes for starters (length must equal category teamSize). Min Items: `1`. Example: `0,1,2`
   * @property { number[] } reserves Participant indexes for reserves. Example: `3`
   */
  export const BulkTeamDtoSchema = z.object({
    categoryId: z.string(),
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
   * @property { BulkTeamDto[] } teams Team rosters (kata-team / kumite-team). Participant indexes refer to participants[].
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
   * @property { number } weight Weight in kg. Example: `65`
   * @property { string } dateOfBirth Date of birth. Example: `2018-02-02T00:00:00.000Z`
   * @property { string } gender Gender (required when matching categories with a gender restriction). Example: `male`
   * @property { string } beltLevel Belt level. Example: `10-kyu`
   */
  export const PublicParticipantProfileDtoSchema = z.object({
    firstName: z.string().max(100),
    lastName: z.string().max(100),
    weight: z.number().gte(0),
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
    weight: z.number(),
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
    weight: z.number(),
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
   * RegistrationResponseDtoSchema
   * @type { object }
   * @property { string } id Registration ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } userId User ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } clubId Club ID (null when no club was linked). Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } tournamentId Tournament ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } categoryId Category ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } status Registration status. Example: `pending`
   * @property { number } finalWeight Final weight in kg. Example: `75.5`
   * @property { string } teamId Team ID when this registration is part of a team roster. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } teamRole Role on the team roster. Example: `starter`
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
