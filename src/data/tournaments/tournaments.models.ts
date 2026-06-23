import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace TournamentsModels {
  /**
   * TournamentPublicLiteResponseDtoSchema
   * @type { object }
   * @property { string } id Tournament ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } name Tournament name. Example: `European Karate Championship 2024`
   * @property { string } startDate Tournament start date and time. Example: `2024-06-15T09:00:00.000Z`
   * @property { string } location Tournament location. Example: `Paris, France`
   * @property { string } registrationDeadline Registration deadline. Example: `2024-06-01T23:59:59.000Z`
   * @property { CommonModels.CategoryResponseDto[] } categories Categories assigned to this tournament
   */
  export const TournamentPublicLiteResponseDtoSchema = z.object({
    id: z.string(),
    name: z.string(),
    startDate: z.string().datetime({ offset: true }),
    location: z.string(),
    registrationDeadline: z.string().datetime({ offset: true }),
    categories: z.array(CommonModels.CategoryResponseDtoSchema),
  });
  export type TournamentPublicLiteResponseDto = z.infer<
    typeof TournamentPublicLiteResponseDtoSchema
  >;

  /**
   * CreateTournamentDtoSchema
   * @type { object }
   * @property { string } name Tournament name. Max Length: `255`. Example: `European Karate Championship 2024`
   * @property { string } location Tournament location. Max Length: `255`. Example: `Paris, France`
   * @property { string } startDate Tournament start date and time. Example: `2024-06-15`
   * @property { string } registrationDeadline Registration deadline. Example: `2024-06-01`
   * @property { string } clubId Club ID to assign to the tournament. Example: `123e4567-e89b-12d3-a456-426614174000`
   */
  export const CreateTournamentDtoSchema = z.object({
    name: z.string().max(255),
    location: z.string().max(255),
    startDate: z.string(),
    registrationDeadline: z.string(),
    clubId: z.string().uuid().optional(),
  });
  export type CreateTournamentDto = z.infer<typeof CreateTournamentDtoSchema>;

  /**
   * AssignCategoriesDtoSchema
   * @type { object }
   * @property { string[] } categoryIds Category IDs to assign to the tournament. Any previously assigned categories not in this list are unassigned. Array order becomes display order.. Example: `123e4567-e89b-12d3-a456-426614174000,223e4567-e89b-12d3-a456-426614174001`
   */
  export const AssignCategoriesDtoSchema = z.object({
    categoryIds: z.array(z.string().uuid()),
  });
  export type AssignCategoriesDto = z.infer<typeof AssignCategoriesDtoSchema>;

  /**
   * UpdateTournamentDtoSchema
   * @type { object }
   * @property { string } name Tournament name. Max Length: `255`. Example: `European Karate Championship 2024`
   * @property { string } location Tournament location. Max Length: `255`. Example: `Paris, France`
   * @property { string } startDate Tournament start date and time. Example: `2024-06-15`
   * @property { string } registrationDeadline Registration deadline. Example: `2024-06-01`
   * @property { string } clubId Club ID to assign to the tournament (null to unassign). Example: `123e4567-e89b-12d3-a456-426614174000`
   */
  export const UpdateTournamentDtoSchema = z
    .object({
      name: z.string().max(255),
      location: z.string().max(255),
      startDate: z.string().nullable(),
      registrationDeadline: z.string().nullable(),
      clubId: z.string().uuid().nullable(),
    })
    .partial();
  export type UpdateTournamentDto = z.infer<typeof UpdateTournamentDtoSchema>;

  /**
   * TournamentsFindAllResponseSchema
   * @type { array }
   */
  export const TournamentsFindAllResponseSchema = z.array(
    CommonModels.TournamentResponseDtoSchema,
  );
  export type TournamentsFindAllResponse = z.infer<
    typeof TournamentsFindAllResponseSchema
  >;
}
