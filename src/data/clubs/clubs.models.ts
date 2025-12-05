import { z } from "zod";

import { CommonModels } from "@/data/common/common.models";

export namespace ClubsModels {
  /**
   * CreateClubDtoSchema
   * @type { object }
   * @property { string } name Club name. Max Length: `255`. Example: `Tokyo Karate Club`
   * @property { string } address Club address. Max Length: `500`. Example: `123 Main Street, Tokyo, Japan`
   * @property { string } country Club country. Max Length: `100`. Example: `Japan`
   */
  export const CreateClubDtoSchema = z.object({
    name: z.string().max(255),
    address: z.string().max(500).optional(),
    country: z.string().max(100).optional(),
  });
  export type CreateClubDto = z.infer<typeof CreateClubDtoSchema>;

  /**
   * UpdateClubDtoSchema
   * @type { object }
   * @property { string } name Club name. Max Length: `255`. Example: `Tokyo Karate Club`
   * @property { string } address Club address. Max Length: `500`. Example: `123 Main Street, Tokyo, Japan`
   * @property { string } country Club country. Max Length: `100`. Example: `Japan`
   */
  export const UpdateClubDtoSchema = z
    .object({ name: z.string().max(255), address: z.string().max(500), country: z.string().max(100) })
    .partial();
  export type UpdateClubDto = z.infer<typeof UpdateClubDtoSchema>;

  /**
   * FindAllResponseSchema
   * @type { array }
   */
  export const FindAllResponseSchema = z.array(CommonModels.ClubResponseDtoSchema);
  export type FindAllResponse = z.infer<typeof FindAllResponseSchema>;
}
