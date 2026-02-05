import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";

export namespace CategoriesModels {
  /**
   * DisciplineEnumSchema
   * @type { enum }
   * @description Discipline,E,x,a,m,p,l,e,:, ,`,k,u,m,i,t,e,`
   */
  export const DisciplineEnumSchema = z.enum(["kata", "kumite", "yako-soku"]);
  export type DisciplineEnum = z.infer<typeof DisciplineEnumSchema>;
  export const DisciplineEnum = DisciplineEnumSchema.enum;

  /**
   * CategoryEnumSchema
   * @type { enum }
   */
  export const CategoryEnumSchema = z.enum(["male", "female"]);
  export type CategoryEnum = z.infer<typeof CategoryEnumSchema>;
  export const CategoryEnum = CategoryEnumSchema.enum;

  /**
   * CreateCategoryDtoSchema
   * @type { object }
   * @property { string } name Category name. Max Length: `255`. Example: `Men Kumite -75kg`
   * @property { string } discipline Discipline. Example: `kumite`
   * @property { string[] } gender Gender categories. Example: `male`
   * @property { number } ageMin Minimum age. Example: `18`
   * @property { number } ageMax Maximum age. Example: `35`
   * @property { number } weightMin Minimum weight in kg. Example: `70`
   * @property { number } weightMax Maximum weight in kg. Example: `75`
   * @property { string } beltMin Minimum belt level. Example: `brown`
   * @property { string } beltMax Maximum belt level. Example: `black`
   */
  export const CreateCategoryDtoSchema = z.object({
    name: z.string().max(255),
    discipline: DisciplineEnumSchema,
    gender: z.array(CategoryEnumSchema),
    ageMin: z.number().gte(0),
    ageMax: z.number().gte(0),
    weightMin: z.number().gte(0).optional(),
    weightMax: z.number().gte(0).optional(),
    beltMin: CommonModels.BeltEnumSchema,
    beltMax: CommonModels.BeltEnumSchema,
  });
  export type CreateCategoryDto = z.infer<typeof CreateCategoryDtoSchema>;

  /**
   * CategoryResponseDtoSchema
   * @type { object }
   * @property { string } id Category ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @property { string } name Category name. Example: `Men Kumite -75kg`
   * @property { string } discipline Discipline. Example: `kumite`
   * @property { string[] } gender Gender categories. Example: `male`
   * @property { number } ageMin Minimum age. Example: `18`
   * @property { number } ageMax Maximum age. Example: `35`
   * @property { number } weightMin Minimum weight in kg. Example: `70`
   * @property { number } weightMax Maximum weight in kg. Example: `75`
   * @property { string } beltMin Minimum belt level. Example: `brown`
   * @property { string } beltMax Maximum belt level. Example: `black`
   * @property { string } createdAt Creation timestamp. Example: `2024-01-01T00:00:00.000Z`
   * @property { string } updatedAt Last update timestamp. Example: `2024-01-01T00:00:00.000Z`
   */
  export const CategoryResponseDtoSchema = z.object({
    id: z.string(),
    name: z.string(),
    discipline: DisciplineEnumSchema,
    gender: z.array(CategoryEnumSchema),
    ageMin: z.number(),
    ageMax: z.number(),
    weightMin: z.number().nullish(),
    weightMax: z.number().nullish(),
    beltMin: CommonModels.BeltEnumSchema,
    beltMax: CommonModels.BeltEnumSchema,
    createdAt: z.string().datetime({ offset: true }),
    updatedAt: z.string().datetime({ offset: true }),
  });
  export type CategoryResponseDto = z.infer<typeof CategoryResponseDtoSchema>;

  /**
   * CreateCategoryWithTournamentDtoSchema
   * @type { object }
   * @property { string } name Category name. Max Length: `255`. Example: `Men Kumite -75kg`
   * @property { string } discipline Discipline. Example: `kumite`
   * @property { string[] } gender Gender categories. Example: `male`
   * @property { number } ageMin Minimum age. Example: `18`
   * @property { number } ageMax Maximum age. Example: `35`
   * @property { number } weightMin Minimum weight in kg. Example: `70`
   * @property { number } weightMax Maximum weight in kg. Example: `75`
   * @property { string } beltMin Minimum belt level. Example: `brown`
   * @property { string } beltMax Maximum belt level. Example: `black`
   * @property { string } tournamentId Tournament ID to assign the category to. Example: `123e4567-e89b-12d3-a456-426614174000`
   */
  export const CreateCategoryWithTournamentDtoSchema = z.object({
    name: z.string().max(255),
    discipline: DisciplineEnumSchema,
    gender: z.array(CategoryEnumSchema),
    ageMin: z.number().gte(0),
    ageMax: z.number().gte(0),
    weightMin: z.number().gte(0).optional(),
    weightMax: z.number().gte(0).optional(),
    beltMin: CommonModels.BeltEnumSchema,
    beltMax: CommonModels.BeltEnumSchema,
    tournamentId: z.string(),
  });
  export type CreateCategoryWithTournamentDto = z.infer<
    typeof CreateCategoryWithTournamentDtoSchema
  >;

  /**
   * UpdateCategoryDtoSchema
   * @type { object }
   * @property { string } name Category name. Max Length: `255`. Example: `Men Kumite -75kg`
   * @property { string } discipline Discipline. Example: `kumite`
   * @property { string[] } gender Gender categories. Example: `male`
   * @property { number } ageMin Minimum age. Example: `18`
   * @property { number } ageMax Maximum age. Example: `35`
   * @property { number } weightMin Minimum weight in kg. Example: `70`
   * @property { number } weightMax Maximum weight in kg. Example: `75`
   * @property { string } beltMin Minimum belt level. Example: `brown`
   * @property { string } beltMax Maximum belt level. Example: `black`
   */
  export const UpdateCategoryDtoSchema = z
    .object({
      name: z.string().max(255),
      discipline: DisciplineEnumSchema,
      gender: z.array(CategoryEnumSchema),
      ageMin: z.number().gte(0),
      ageMax: z.number().gte(0),
      weightMin: z.number().gte(0),
      weightMax: z.number().gte(0),
      beltMin: CommonModels.BeltEnumSchema,
      beltMax: CommonModels.BeltEnumSchema,
    })
    .partial();
  export type UpdateCategoryDto = z.infer<typeof UpdateCategoryDtoSchema>;

  /**
   * CategoriesFindAllResponseSchema
   * @type { array }
   */
  export const CategoriesFindAllResponseSchema = z.array(
    CategoryResponseDtoSchema,
  );
  export type CategoriesFindAllResponse = z.infer<
    typeof CategoriesFindAllResponseSchema
  >;
}
