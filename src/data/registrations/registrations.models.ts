import { z } from "zod";

import { CommonModels } from "@/data/common/common.models";

export namespace RegistrationsModels {
  /**
   * StatusEnumSchema
   * @type { enum }
   * @description Registration status,E,x,a,m,p,l,e,:, ,`,p,e,n,d,i,n,g,`
   */
  export const StatusEnumSchema = z.enum(["pending", "approved", "rejected"]);
  export type StatusEnum = z.infer<typeof StatusEnumSchema>;
  export const StatusEnum = StatusEnumSchema.enum;

  /**
   * RegistrationResponseDtoSchema
   * @type { object }
   * @property { string } id Registration ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } userId User ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } clubId Club ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } tournamentId Tournament ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } categoryId Category ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } status Registration status. Example: `pending`
   * @property { number } finalWeight Final weight in kg. Example: `75.5`
   * @property { CommonModels.UserResponseDto } user User information
   * @property { CommonModels.ClubResponseDto } club Club information
   * @property { string } createdAt Creation timestamp. Example: `2024-01-01T00:00:00.000Z`
   * @property { string } updatedAt Last update timestamp. Example: `2024-01-01T00:00:00.000Z`
   */
  export const RegistrationResponseDtoSchema = z.object({
    id: z.string(),
    userId: z.string(),
    clubId: z.string(),
    tournamentId: z.string(),
    categoryId: z.string(),
    status: StatusEnumSchema,
    finalWeight: z.number().nullish(),
    user: CommonModels.UserResponseDtoSchema.nullish(),
    club: CommonModels.ClubResponseDtoSchema.nullish(),
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  });
  export type RegistrationResponseDto = z.infer<typeof RegistrationResponseDtoSchema>;

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
  export type CreateRegistrationDto = z.infer<typeof CreateRegistrationDtoSchema>;

  /**
   * CreateRegistrationWithUserDtoSchema
   * @type { object }
   * @property { string } email User email address (used to find or create user). Example: `john.doe@example.com`
   * @property { string } firstName First name. Max Length: `100`. Example: `John`
   * @property { string } lastName Last name. Max Length: `100`. Example: `Doe`
   * @property { number } weight Weight in kg. Example: `75.5`
   * @property { number } age Age in years (used to calculate birthDate). Maximum: `150`. Example: `25`
   * @property { string } gender Gender. Example: `male`
   * @property { string } beltLevel Belt level. Example: `black`
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
    age: z.number().gte(0).lte(150).optional(),
    gender: CommonModels.GenderEnumSchema.optional(),
    beltLevel: CommonModels.BeltEnumSchema.optional(),
    tournamentId: z.string(),
    categoryId: z.string(),
    clubId: z.string().optional(),
    finalWeight: z.number().gte(0).optional(),
  });
  export type CreateRegistrationWithUserDto = z.infer<typeof CreateRegistrationWithUserDtoSchema>;
}
