import { z } from "zod";

import { AppRestClient } from "@/util/rest/clients/app-rest-client";

import { CategoriesModels } from "./categories.models";

export namespace CategoriesApi {
  export const create = (data: CategoriesModels.CreateCategoryDto) => {
    return AppRestClient.post({ resSchema: CategoriesModels.CategoryResponseDtoSchema }, `/categories`, data);
  };

  export const findAll = () => {
    return AppRestClient.get({ resSchema: CategoriesModels.CategoriesFindAllResponseSchema }, `/categories`);
  };

  export const createAndAssign = (data: CategoriesModels.CreateCategoryWithTournamentDto) => {
    return AppRestClient.post(
      { resSchema: CategoriesModels.CategoryResponseDtoSchema },
      `/categories/create-and-assign`,
      data,
    );
  };

  export const findOne = (id: string) => {
    return AppRestClient.get({ resSchema: CategoriesModels.CategoryResponseDtoSchema }, `/categories/${id}`);
  };

  export const update = (id: string, data: CategoriesModels.UpdateCategoryDto) => {
    return AppRestClient.put({ resSchema: CategoriesModels.CategoryResponseDtoSchema }, `/categories/${id}`, data);
  };

  export const remove = (id: string) => {
    return AppRestClient.delete({ resSchema: z.void() }, `/categories/${id}`);
  };
}
