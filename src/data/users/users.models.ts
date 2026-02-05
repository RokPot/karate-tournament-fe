import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace UsersModels {
  /**
   * UpdateUserDtoSchema
   * @type { object }
   * @property { string } firstName First name. Max Length: `100`. Example: `John`
   * @property { string } lastName Last name. Max Length: `100`. Example: `Doe`
   * @property { string } email Email. Max Length: `255`. Example: `user@example.com`
   * @property { string } gender Gender. Example: `male`
   * @property { string } birthDate Birth date. Example: `1990-01-01`
   * @property { number } weight Weight in kg. Maximum: `999.99`. Example: `75.5`
   * @property { string } beltLevel Belt level. Example: `black`
   * @property { string[] } roles User roles. Example: `club_member,club_coach`
   * @property { string } clubId Club ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   */
  export const UpdateUserDtoSchema = z
    .object({
      firstName: z.string().max(100),
      lastName: z.string().max(100),
      email: z.string().max(255).email(),
      gender: CommonModels.GenderEnumSchema,
      birthDate: z.string().nullable(),
      weight: z.number().gte(0).lte(999.99),
      beltLevel: CommonModels.BeltEnumSchema,
      roles: z.array(CommonModels.UserEnumSchema),
      clubId: z.string(),
    })
    .partial();
  export type UpdateUserDto = z.infer<typeof UpdateUserDtoSchema>;
}
