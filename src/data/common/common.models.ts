import { z } from "zod";

export namespace CommonModels {
  /**
   * GenderEnumSchema
   * @type { enum }
   * @description Gender,E,x,a,m,p,l,e,:, ,`,m,a,l,e,`
   */
  export const GenderEnumSchema = z.enum(["male", "female", "other"]);
  export type GenderEnum = z.infer<typeof GenderEnumSchema>;
  export const GenderEnum = GenderEnumSchema.enum;

  /**
   * BeltEnumSchema
   * @type { enum }
   * @description Maximum belt level,E,x,a,m,p,l,e,:, ,`,b,l,a,c,k,`
   */
  export const BeltEnumSchema = z.enum([
    "white",
    "yellow",
    "orange",
    "green",
    "blue",
    "brown",
    "black",
    "black_dan_1",
    "black_dan_2",
    "black_dan_3",
    "black_dan_4",
    "black_dan_5",
    "black_dan_6",
    "black_dan_7",
    "black_dan_8",
    "black_dan_9",
    "black_dan_10",
  ]);
  export type BeltEnum = z.infer<typeof BeltEnumSchema>;
  export const BeltEnum = BeltEnumSchema.enum;

  /**
   * UserEnumSchema
   * @type { enum }
   */
  export const UserEnumSchema = z.enum(["admin", "organizer", "coach", "competitor", "judge", "staff"]);
  export type UserEnum = z.infer<typeof UserEnumSchema>;
  export const UserEnum = UserEnumSchema.enum;

  /**
   * ClubResponseDtoSchema
   * @type { object }
   * @property { string } id Club ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } name Club name. Example: `Tokyo Karate Club`
   * @property { string } address Club address. Example: `123 Main Street, Tokyo, Japan`
   * @property { string } country Club country. Example: `Japan`
   * @property { string } createdAt Creation timestamp. Example: `2024-01-01T00:00:00.000Z`
   * @property { string } updatedAt Last update timestamp. Example: `2024-01-01T00:00:00.000Z`
   */
  export const ClubResponseDtoSchema = z.object({
    id: z.string(),
    name: z.string(),
    address: z.string().nullish(),
    country: z.string().nullish(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
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
   * @property { string } gender Gender. Example: `male`
   * @property { string } birthDate Birth date. Example: `1990-01-01`
   * @property { number } weight Weight in kg. Example: `75.5`
   * @property { string } beltLevel Belt level. Example: `black`
   * @property { string[] } roles User roles. Example: `competitor`
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
    gender: CommonModels.GenderEnumSchema.nullish(),
    birthDate: z.string().nullish(),
    weight: z.number().nullish(),
    beltLevel: CommonModels.BeltEnumSchema.nullish(),
    roles: z.array(CommonModels.UserEnumSchema),
    club: CommonModels.ClubResponseDtoSchema.nullish(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  });
  export type UserResponseDto = z.infer<typeof UserResponseDtoSchema>;
}
