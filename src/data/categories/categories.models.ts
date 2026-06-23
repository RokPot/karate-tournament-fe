import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace CategoriesModels {
  /**
   * CreateCategoryDtoSchema
   * @type { object }
   * @property { string } name Category name. Max Length: `255`. Example: `Men Kumite -75kg`
   * @property { string } discipline Discipline. Example: `yako-soku-kumite`
   * @property { string } subDiscipline Sub-discipline (null/omit = not specified). Example: `gohon-ippon-kumite`
   * @property { string } gender Category gender (null/omit = no gender restriction). Example: `male`
   * @property { number } ageMin Minimum age in years (0 = no lower limit). Nullable.. Example: `18`
   * @property { number } ageMax Maximum age in years (0 = no upper limit). Nullable.. Example: `35`
   * @property { number } weightMin Minimum weight in kg (0 = no lower limit). Nullable.. Example: `70`
   * @property { number } weightMax Maximum weight in kg (0 = no upper limit). Nullable.. Example: `75`
   * @property { string } beltMin Minimum belt level (null/omit = no lower limit). Example: `4-kyu`
   * @property { string } beltMax Maximum belt level (null/omit = no upper limit). Example: `2-dan`
   * @property { number } teamSize Main team roster size (null/omit = not applicable for individual categories). Example: `3`
   * @property { number } teamReservesSize Number of reserve participants allowed (null/omit = not applicable). Example: `1`
   */
  export const CreateCategoryDtoSchema = z.object({
    name: z.string().max(255),
    discipline: CommonModels.DisciplineEnumSchema,
    subDiscipline: CommonModels.SubDisciplineEnumSchema.nullish(),
    gender: CommonModels.CategoryGenderEnumSchema.nullish(),
    ageMin: z.number().gte(0).nullish(),
    ageMax: z.number().gte(0).nullish(),
    weightMin: z.number().gte(0).nullish(),
    weightMax: z.number().gte(0).nullish(),
    beltMin: CommonModels.BeltEnumSchema.nullish(),
    beltMax: CommonModels.BeltEnumSchema.nullish(),
    teamSize: z.number().gte(0).nullish(),
    teamReservesSize: z.number().gte(0).nullish(),
  });
  export type CreateCategoryDto = z.infer<typeof CreateCategoryDtoSchema>;

  /**
   * CreateCategoryWithTournamentDtoSchema
   * @type { object }
   * @property { string } name Category name. Max Length: `255`. Example: `Men Kumite -75kg`
   * @property { string } discipline Discipline. Example: `yako-soku-kumite`
   * @property { string } subDiscipline Sub-discipline (null/omit = not specified). Example: `gohon-ippon-kumite`
   * @property { string } gender Category gender (null/omit = no gender restriction). Example: `male`
   * @property { number } ageMin Minimum age in years (0 = no lower limit). Nullable.. Example: `18`
   * @property { number } ageMax Maximum age in years (0 = no upper limit). Nullable.. Example: `35`
   * @property { number } weightMin Minimum weight in kg (0 = no lower limit). Nullable.. Example: `70`
   * @property { number } weightMax Maximum weight in kg (0 = no upper limit). Nullable.. Example: `75`
   * @property { string } beltMin Minimum belt level (null/omit = no lower limit). Example: `4-kyu`
   * @property { string } beltMax Maximum belt level (null/omit = no upper limit). Example: `2-dan`
   * @property { number } teamSize Main team roster size (null/omit = not applicable for individual categories). Example: `3`
   * @property { number } teamReservesSize Number of reserve participants allowed (null/omit = not applicable). Example: `1`
   * @property { string } tournamentId Tournament ID to assign the category to. Example: `123e4567-e89b-12d3-a456-426614174000`
   */
  export const CreateCategoryWithTournamentDtoSchema = z.object({
    name: z.string().max(255),
    discipline: CommonModels.DisciplineEnumSchema,
    subDiscipline: CommonModels.SubDisciplineEnumSchema.nullish(),
    gender: CommonModels.CategoryGenderEnumSchema.nullish(),
    ageMin: z.number().gte(0).nullish(),
    ageMax: z.number().gte(0).nullish(),
    weightMin: z.number().gte(0).nullish(),
    weightMax: z.number().gte(0).nullish(),
    beltMin: CommonModels.BeltEnumSchema.nullish(),
    beltMax: CommonModels.BeltEnumSchema.nullish(),
    teamSize: z.number().gte(0).nullish(),
    teamReservesSize: z.number().gte(0).nullish(),
    tournamentId: z.string(),
  });
  export type CreateCategoryWithTournamentDto = z.infer<
    typeof CreateCategoryWithTournamentDtoSchema
  >;

  /**
   * DuplicateCategoriesDtoSchema
   * @type { object }
   * @property { string[] } categoryIds Category IDs to duplicate. Min Items: `1`. Example: `123e4567-e89b-12d3-a456-426614174000,223e4567-e89b-12d3-a456-426614174001`
   */
  export const DuplicateCategoriesDtoSchema = z.object({
    categoryIds: z.array(z.string().uuid()).min(1),
  });
  export type DuplicateCategoriesDto = z.infer<
    typeof DuplicateCategoriesDtoSchema
  >;

  /**
   * UpdateCategoryDtoSchema
   * @type { object }
   * @property { string } name Category name. Max Length: `255`. Example: `Men Kumite -75kg`
   * @property { string } discipline Discipline. Example: `yako-soku-kumite`
   * @property { string } subDiscipline Sub-discipline (null = not specified). Example: `gohon-ippon-kumite`
   * @property { string } gender Category gender (null = no gender restriction). Example: `male`
   * @property { number } ageMin Minimum age in years (0 = no lower limit). Nullable.. Example: `18`
   * @property { number } ageMax Maximum age in years (0 = no upper limit). Nullable.. Example: `35`
   * @property { number } weightMin Minimum weight in kg (0 = no lower limit). Nullable.. Example: `70`
   * @property { number } weightMax Maximum weight in kg (0 = no upper limit). Nullable.. Example: `75`
   * @property { string } beltMin Minimum belt level (null = no lower limit). Example: `4-kyu`
   * @property { string } beltMax Maximum belt level (null = no upper limit). Example: `2-dan`
   * @property { number } teamSize Main team roster size (null = not applicable). Example: `3`
   * @property { number } teamReservesSize Number of reserve participants allowed (null = not applicable). Example: `1`
   */
  export const UpdateCategoryDtoSchema = z
    .object({
      name: z.string().max(255),
      discipline: CommonModels.DisciplineEnumSchema,
      subDiscipline: CommonModels.SubDisciplineEnumSchema.nullable(),
      gender: CommonModels.CategoryGenderEnumSchema.nullable(),
      ageMin: z.number().gte(0).nullable(),
      ageMax: z.number().gte(0).nullable(),
      weightMin: z.number().gte(0).nullable(),
      weightMax: z.number().gte(0).nullable(),
      beltMin: CommonModels.BeltEnumSchema.nullable(),
      beltMax: CommonModels.BeltEnumSchema.nullable(),
      teamSize: z.number().gte(0).nullable(),
      teamReservesSize: z.number().gte(0).nullable(),
    })
    .partial();
  export type UpdateCategoryDto = z.infer<typeof UpdateCategoryDtoSchema>;

  /**
   * DeleteCategoriesDtoSchema
   * @type { object }
   * @property { string[] } categoryIds Category IDs to delete. Min Items: `1`. Example: `123e4567-e89b-12d3-a456-426614174000,223e4567-e89b-12d3-a456-426614174001`
   */
  export const DeleteCategoriesDtoSchema = z.object({
    categoryIds: z.array(z.string().uuid()).min(1),
  });
  export type DeleteCategoriesDto = z.infer<typeof DeleteCategoriesDtoSchema>;

  /**
   * CategoriesFindAllResponseSchema
   * @type { array }
   */
  export const CategoriesFindAllResponseSchema = z.array(
    CommonModels.CategoryResponseDtoSchema,
  );
  export type CategoriesFindAllResponse = z.infer<
    typeof CategoriesFindAllResponseSchema
  >;

  /**
   * DuplicateResponseSchema
   * @type { array }
   */
  export const DuplicateResponseSchema = z.array(
    CommonModels.CategoryResponseDtoSchema,
  );
  export type DuplicateResponse = z.infer<typeof DuplicateResponseSchema>;
}
