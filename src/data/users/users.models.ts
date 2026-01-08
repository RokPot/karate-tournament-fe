import { z } from "zod";

import { CommonModels } from "@/data/common/common.models";

export namespace UsersModels {
  /**
   * GenderEnumSchema
   * @type { enum }
   * @description Gender,E,x,a,m,p,l,e,:, ,`,m,a,l,e,`
   */
  export const GenderEnumSchema = z.enum(["male", "female", "other"]);
  export type GenderEnum = z.infer<typeof GenderEnumSchema>;
  export const GenderEnum = GenderEnumSchema.enum;

  /**
   * BeltLevelEnumSchema
   * @type { enum }
   * @description Belt level,E,x,a,m,p,l,e,:, ,`,b,l,a,c,k,`
   */
  export const BeltLevelEnumSchema = z.enum([
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
  export type BeltLevelEnum = z.infer<typeof BeltLevelEnumSchema>;
  export const BeltLevelEnum = BeltLevelEnumSchema.enum;

  /**
   * UserEnumSchema
   * @type { enum }
   */
  export const UserEnumSchema = z.enum(["admin", "organizer", "coach", "competitor", "judge", "staff"]);
  export type UserEnum = z.infer<typeof UserEnumSchema>;
  export const UserEnum = UserEnumSchema.enum;

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
   * @property { CommonModels.ClubResponseDto } club Club information
   * @property { string } createdAt Creation timestamp. Example: `2024-01-01T00:00:00.000Z`
   * @property { string } updatedAt Last update timestamp. Example: `2024-01-01T00:00:00.000Z`
   */
  export const UserResponseDtoSchema = z.object({
    id: z.string(),
    auth0Id: z.string(),
    clubId: z.string().nullish(),
    firstName: z.string().nullish(),
    lastName: z.string().nullish(),
    gender: GenderEnumSchema.nullish(),
    birthDate: z.string().datetime({ offset: true }).nullish(),
    weight: z.number().nullish(),
    beltLevel: BeltLevelEnumSchema.nullish(),
    roles: z.array(UserEnumSchema),
    club: CommonModels.ClubResponseDtoSchema.nullish(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  });
  export type UserResponseDto = z.infer<typeof UserResponseDtoSchema>;

  /**
   * UpdateUserDtoSchema
   * @type { object }
   * @property { string } firstName First name. Max Length: `100`. Example: `John`
   * @property { string } lastName Last name. Max Length: `100`. Example: `Doe`
   * @property { string } gender Gender. Example: `male`
   * @property { string } birthDate Birth date. Example: `1990-01-01`
   * @property { number } weight Weight in kg. Maximum: `999.99`. Example: `75.5`
   * @property { string } beltLevel Belt level. Example: `black`
   * @property { string[] } roles User roles. Example: `competitor,coach`
   * @property { string } clubId Club ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   */
  export const UpdateUserDtoSchema = z
    .object({
      firstName: z.string().max(100),
      lastName: z.string().max(100),
      gender: GenderEnumSchema,
      birthDate: z.string(),
      weight: z.number().gte(0).lte(999.99),
      beltLevel: BeltLevelEnumSchema,
      roles: z.array(UserEnumSchema),
      clubId: z.string(),
    })
    .partial();
  export type UpdateUserDto = z.infer<typeof UpdateUserDtoSchema>;
}
