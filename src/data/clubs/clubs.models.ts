import { z } from "zod";

import { CommonModels } from "@/data/common/common.models";

export namespace ClubsModels {
  /**
   * CreateClubDtoSchema
   * @type { object }
   * @property { string } name Club name. Max Length: `255`. Example: `Tokyo Karate Club`
   * @property { string } address Club address. Max Length: `500`. Example: `123 Main Street, Tokyo, Japan`
   * @property { string } country Club country. Max Length: `100`. Example: `Japan`
   * @property { string } ownerEmail Club owner email; when provided, an invitation is created and inviteUrl returned. Max Length: `255`. Example: `owner@example.com`
   * @property { string } ownerFirstName Club owner first name. Max Length: `100`. Example: `John`
   * @property { string } ownerLastName Club owner last name. Max Length: `100`. Example: `Doe`
   */
  export const CreateClubDtoSchema = z.object({
    name: z.string().max(255),
    address: z.string().max(500).optional(),
    country: z.string().max(100).optional(),
    ownerEmail: z.string().max(255).email().optional(),
    ownerFirstName: z.string().max(100).optional(),
    ownerLastName: z.string().max(100).optional(),
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
   * ClubsFindAllResponseSchema
   * @type { array }
   */
  export const ClubsFindAllResponseSchema = z.array(CommonModels.ClubResponseDtoSchema);
  export type ClubsFindAllResponse = z.infer<typeof ClubsFindAllResponseSchema>;

  /**
   * GetMembersResponseSchema
   * @type { array }
   */
  export const GetMembersResponseSchema = z.array(CommonModels.UserResponseDtoSchema);
  export type GetMembersResponse = z.infer<typeof GetMembersResponseSchema>;

  /**
   * GetTournamentsResponseSchema
   * @type { array }
   */
  export const GetTournamentsResponseSchema = z.array(CommonModels.TournamentResponseDtoSchema);
  export type GetTournamentsResponse = z.infer<typeof GetTournamentsResponseSchema>;
}
