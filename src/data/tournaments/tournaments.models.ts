import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace TournamentsModels {
  /**
   * TournamentPublicLiteStatusEnumSchema
   * @type { enum }
   * @description Public lifecycle status. Pending and declined tournaments are not returned.,E,x,a,m,p,l,e,:, ,`,a,p,p,r,o,v,e,d,`
   */
  export const TournamentPublicLiteStatusEnumSchema = z.enum([
    "approved",
    "in_progress",
    "ended",
  ]);
  export type TournamentPublicLiteStatusEnum = z.infer<
    typeof TournamentPublicLiteStatusEnumSchema
  >;
  export const TournamentPublicLiteStatusEnum =
    TournamentPublicLiteStatusEnumSchema.enum;

  /**
   * CreateTournamentDtoSchema
   * @type { object }
   * @property { string } name Tournament name. Max Length: `255`. Example: `European Karate Championship 2024`
   * @property { string } location Tournament location. Max Length: `255`. Example: `Paris, France`
   * @property { string } startDate Tournament start date and time. Example: `2024-06-15`
   * @property { string } registrationDeadline Registration deadline. Example: `2024-06-01`
   * @property { string } clubId Club ID to assign to the tournament. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { CommonModels.TournamentFeeScheduleDto } fees Registration fee schedule for this tournament
   */
  export const CreateTournamentDtoSchema = z.object({
    name: z.string().max(255),
    location: z.string().max(255),
    startDate: z.string(),
    registrationDeadline: z.string(),
    clubId: z.string().uuid().optional(),
    fees: CommonModels.TournamentFeeScheduleDtoSchema,
  });
  export type CreateTournamentDto = z.infer<typeof CreateTournamentDtoSchema>;

  /**
   * TournamentPublicLiteResponseDtoSchema
   * @type { object }
   * @property { string } id Tournament ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } name Tournament name. Example: `European Karate Championship 2024`
   * @property { string } startDate Tournament start date and time. Example: `2024-06-15T09:00:00.000Z`
   * @property { string } location Tournament location. Example: `Paris, France`
   * @property { string } registrationDeadline Registration deadline. Example: `2024-06-01T23:59:59.000Z`
   * @property { string } status Public lifecycle status. Pending and declined tournaments are not returned.. Example: `approved`
   * @property { string } startedAt When the tournament was marked in progress. Example: `2024-06-15T09:00:00.000Z`
   * @property { string } endedAt When the tournament was marked ended. Example: `2024-06-16T18:00:00.000Z`
   * @property { string } clubId Club ID assigned to the tournament. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { CommonModels.ClubResponseDto } club Club assigned to the tournament, if any
   * @property { CommonModels.TournamentFeeScheduleDto } fees Registration fee schedule for this tournament
   * @property { CommonModels.CategoryResponseDto[] } categories Categories assigned to this tournament
   */
  export const TournamentPublicLiteResponseDtoSchema = z.object({
    id: z.string(),
    name: z.string(),
    startDate: z.string().datetime({ offset: true }),
    location: z.string(),
    registrationDeadline: z.string().datetime({ offset: true }),
    status: TournamentPublicLiteStatusEnumSchema,
    startedAt: z.string().datetime({ offset: true }).nullish(),
    endedAt: z.string().datetime({ offset: true }).nullish(),
    clubId: z.string().nullish(),
    club: CommonModels.ClubResponseDtoSchema.nullish(),
    fees: CommonModels.TournamentFeeScheduleDtoSchema,
    categories: z.array(CommonModels.CategoryResponseDtoSchema),
  });
  export type TournamentPublicLiteResponseDto = z.infer<
    typeof TournamentPublicLiteResponseDtoSchema
  >;

  /**
   * UpdateTournamentFeeScheduleDtoSchema
   * @type { object }
   * @property { number } oneCategory Total fee when a participant is registered in 1 individual category. Example: `10`
   * @property { number } twoCategories Total fee when a participant is registered in 2 individual categories. Example: `20`
   * @property { number } threeOrMoreCategories Total fee when a participant is registered in 3 or more individual categories. Example: `30`
   * @property { number } team Fee charged once per team in a team category. Example: `30`
   */
  export const UpdateTournamentFeeScheduleDtoSchema = z
    .object({
      oneCategory: z.number().gte(0),
      twoCategories: z.number().gte(0),
      threeOrMoreCategories: z.number().gte(0),
      team: z.number().gte(0),
    })
    .partial();
  export type UpdateTournamentFeeScheduleDto = z.infer<
    typeof UpdateTournamentFeeScheduleDtoSchema
  >;

  /**
   * UpdateTournamentDtoSchema
   * @type { object }
   * @property { string } name Tournament name. Max Length: `255`. Example: `European Karate Championship 2024`
   * @property { string } location Tournament location. Max Length: `255`. Example: `Paris, France`
   * @property { string } startDate Tournament start date and time. Example: `2024-06-15`
   * @property { string } registrationDeadline Registration deadline. Example: `2024-06-01`
   * @property { string } clubId Club ID to assign to the tournament (null to unassign). Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { UpdateTournamentFeeScheduleDto } fees Registration fee schedule. Any field sent replaces that amount.
   */
  export const UpdateTournamentDtoSchema = z
    .object({
      name: z.string().max(255),
      location: z.string().max(255),
      startDate: z.string().nullable(),
      registrationDeadline: z.string().nullable(),
      clubId: z.string().uuid().nullable(),
      fees: UpdateTournamentFeeScheduleDtoSchema,
    })
    .partial();
  export type UpdateTournamentDto = z.infer<typeof UpdateTournamentDtoSchema>;

  /**
   * DeclineTournamentDtoSchema
   * @type { object }
   * @property { string } reason Reason for declining, stored as reviewNote. Max Length: `1000`. Example: `Missing venue details`
   */
  export const DeclineTournamentDtoSchema = z
    .object({ reason: z.string().max(1000) })
    .partial();
  export type DeclineTournamentDto = z.infer<typeof DeclineTournamentDtoSchema>;

  /**
   * ResubmitTournamentDtoSchema
   * @type { object }
   * @property { string } note Note for the resubmission, stored as reviewNote. Max Length: `1000`. Example: `Venue and schedule updated`
   */
  export const ResubmitTournamentDtoSchema = z
    .object({ note: z.string().max(1000) })
    .partial();
  export type ResubmitTournamentDto = z.infer<
    typeof ResubmitTournamentDtoSchema
  >;

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
   * TournamentsFindAllStatusParamSchema
   * @type { string }
   * @description E,x,a,m,p,l,e,:, ,`,a,p,p,r,o,v,e,d,`
   */
  export const TournamentsFindAllStatusParamSchema =
    CommonModels.TournamentsFindAllStatusEnumSchema.optional();
  export type TournamentsFindAllStatusParam = z.infer<
    typeof TournamentsFindAllStatusParamSchema
  >;

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

  /**
   * FindRegisteredResponseSchema
   * @type { array }
   */
  export const FindRegisteredResponseSchema = z.array(
    CommonModels.TournamentResponseDtoSchema,
  );
  export type FindRegisteredResponse = z.infer<
    typeof FindRegisteredResponseSchema
  >;
}
