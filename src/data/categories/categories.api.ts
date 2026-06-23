import { AppRestClient } from "@/util/rest/clients/app-rest-client";
import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";
import { CategoriesModels } from "./categories.models";

export namespace CategoriesApi {
  export const create = (data: CategoriesModels.CreateCategoryDto) => {
    return AppRestClient.post(
      { resSchema: CommonModels.CategoryResponseDtoSchema },
      `/categories`,
      data,
    );
  };

  export const findAll = () => {
    return AppRestClient.get(
      { resSchema: CategoriesModels.CategoriesFindAllResponseSchema },
      `/categories`,
    );
  };

  export const removeMany = (data: CategoriesModels.DeleteCategoriesDto) => {
    return AppRestClient.delete({ resSchema: z.void() }, `/categories`, data);
  };

  export const createAndAssign = (
    data: CategoriesModels.CreateCategoryWithTournamentDto,
  ) => {
    return AppRestClient.post(
      { resSchema: CommonModels.CategoryResponseDtoSchema },
      `/categories/create-and-assign`,
      data,
    );
  };

  export const duplicate = (data: CategoriesModels.DuplicateCategoriesDto) => {
    return AppRestClient.post(
      { resSchema: CategoriesModels.DuplicateResponseSchema },
      `/categories/duplicate`,
      data,
    );
  };

  export const findOne = (id: string) => {
    return AppRestClient.get(
      { resSchema: CommonModels.CategoryResponseDtoSchema },
      `/categories/${id}`,
    );
  };

  export const update = (
    id: string,
    data: CategoriesModels.UpdateCategoryDto,
  ) => {
    return AppRestClient.put(
      { resSchema: CommonModels.CategoryResponseDtoSchema },
      `/categories/${id}`,
      data,
    );
  };

  export const remove = (id: string) => {
    return AppRestClient.delete({ resSchema: z.void() }, `/categories/${id}`);
  };
}
