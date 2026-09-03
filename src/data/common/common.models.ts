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
   * TournamentStatusEnumSchema
   * @type { enum }
   * @description Tournament approval status. Example: `pending`
   */
  export const TournamentStatusEnumSchema = z.enum([
    "pending",
    "approved",
    "declined",
  ]);
  export type TournamentStatusEnum = z.infer<typeof TournamentStatusEnumSchema>;
  export const TournamentStatusEnum = TournamentStatusEnumSchema.enum;

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
   * @property { string } status Approval status. Example: `pending`
   * @property { string } reviewedAt When the tournament was last approved or declined. Example: `2024-01-02T00:00:00.000Z`
   * @property { string } reviewedBy User ID of the admin who last approved or declined. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } reviewNote Decline reason or resubmit note. Example: `Dates clash with an existing championship`
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
    status: CommonModels.TournamentStatusEnumSchema,
    reviewedAt: z.string().nullish(),
    reviewedBy: z.string().nullish(),
    reviewNote: z.string().nullish(),
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
   * @property { string } clubId Owning club ID (null = global catalog). Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { number } registrationCount Registrations in this category for the current tournament (absent until the counts API ships). Example: `12`
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
    clubId: z.string().nullish(),
    registrationCount: z.number().nullish(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  });
  export type CategoryResponseDto = z.infer<typeof CategoryResponseDtoSchema>;
}
