import { z } from "zod";

export namespace CommonModels {
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
}
