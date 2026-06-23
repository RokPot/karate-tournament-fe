import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  QueryModule,
  InvalidateQueryOptions,
  invalidateQueries,
} from "@/data/invalidateQueries";
import { AppQueryOptions, AppMutationOptions } from "@/types/react-query";
import { CategoriesModels } from "./categories.models";
import { CategoriesApi } from "./categories.api";

export namespace CategoriesQueries {
  export const moduleName = QueryModule.Categories;

  export const keys = {
    all: [moduleName] as const,
    findAll: () => [...keys.all, "/categories"] as const,
    findOne: (id: string) => [...keys.all, "/categories/:id", id] as const,
  };

  /**
   * Mutation `useCreate`
   * @summary Create a new category
   * @description Creates a new tournament category. Only name and discipline are required; subDiscipline, gender, age, weight, belt limits, and team size (teamSize, teamReservesSize) are optional.
   * @param { CategoriesModels.CreateCategoryDto } mutation.data Body parameter
   * @param { AppMutationOptions & InvalidateQueryOptions } options Mutation options
   * @returns { UseMutationResult<CommonModels.CategoryResponseDto> } Category created successfully
   * @statusCodes [201, 400, 401]
   */
  export const useCreate = (
    options?: AppMutationOptions<
      typeof CategoriesApi.create,
      { data: CategoriesModels.CreateCategoryDto }
    > &
      InvalidateQueryOptions,
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ data }) => CategoriesApi.create(data),
      ...options,
      onSuccess: (...args) => {
        invalidateQueries(queryClient, moduleName, options);
        options?.onSuccess?.(...args);
      },
    });
  };

  /**
   * Query `useFindAll`
   * @summary Get all categories
   * @description Retrieves a list of all categories
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<CategoriesModels.CategoriesFindAllResponse> } List of categories
   * @statusCodes [200, 401]
   */
  export const useFindAll = <TData>(
    options?: AppQueryOptions<typeof CategoriesApi.findAll, TData>,
  ) => {
    return useQuery({
      queryKey: keys.findAll(),
      queryFn: CategoriesApi.findAll,
      ...options,
    });
  };

  /**
   * Mutation `useRemoveMany`
   * @summary Delete categories
   * @description Deletes one or more categories in a single transaction. If any requested category cannot be deleted, the whole operation is rolled back.
   * @param { CategoriesModels.DeleteCategoriesDto } mutation.data Body parameter
   * @param { AppMutationOptions & InvalidateQueryOptions } options Mutation options
   * @returns { UseMutationResult<void> } Categories deleted successfully
   * @statusCodes [204, 400, 401, 404, 409]
   */
  export const useRemoveMany = (
    options?: AppMutationOptions<
      typeof CategoriesApi.removeMany,
      { data: CategoriesModels.DeleteCategoriesDto }
    > &
      InvalidateQueryOptions,
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ data }) => CategoriesApi.removeMany(data),
      ...options,
      onSuccess: (...args) => {
        invalidateQueries(queryClient, moduleName, options);
        options?.onSuccess?.(...args);
      },
    });
  };

  /**
   * Mutation `useCreateAndAssign`
   * @summary Create a category and assign to tournament
   * @description Creates a new category and assigns it to the specified tournament. Only name and discipline are required; subDiscipline, gender, age, weight, belt limits, and team size (teamSize, teamReservesSize) are optional.
   * @param { CategoriesModels.CreateCategoryWithTournamentDto } mutation.data Body parameter
   * @param { AppMutationOptions & InvalidateQueryOptions } options Mutation options
   * @returns { UseMutationResult<CommonModels.CategoryResponseDto> } Category created and assigned successfully
   * @statusCodes [201, 400, 401, 404]
   */
  export const useCreateAndAssign = (
    options?: AppMutationOptions<
      typeof CategoriesApi.createAndAssign,
      { data: CategoriesModels.CreateCategoryWithTournamentDto }
    > &
      InvalidateQueryOptions,
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ data }) => CategoriesApi.createAndAssign(data),
      ...options,
      onSuccess: (...args) => {
        invalidateQueries(queryClient, moduleName, options);
        options?.onSuccess?.(...args);
      },
    });
  };

  /**
   * Mutation `useDuplicate`
   * @summary Duplicate categories
   * @description Creates standalone copies of the specified categories. Copies scalar fields only; tournament assignments, registrations, and brackets are not duplicated.
   * @param { CategoriesModels.DuplicateCategoriesDto } mutation.data Body parameter
   * @param { AppMutationOptions & InvalidateQueryOptions } options Mutation options
   * @returns { UseMutationResult<CategoriesModels.DuplicateResponse> } Categories duplicated successfully
   * @statusCodes [201, 400, 401, 404]
   */
  export const useDuplicate = (
    options?: AppMutationOptions<
      typeof CategoriesApi.duplicate,
      { data: CategoriesModels.DuplicateCategoriesDto }
    > &
      InvalidateQueryOptions,
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ data }) => CategoriesApi.duplicate(data),
      ...options,
      onSuccess: (...args) => {
        invalidateQueries(queryClient, moduleName, options);
        options?.onSuccess?.(...args);
      },
    });
  };

  /**
   * Query `useFindOne`
   * @summary Get category by ID
   * @description Retrieves a specific category by its ID
   * @param { string } object.id Path parameter. Category ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @param { AppQueryOptions } options Query options
   * @returns { UseQueryResult<CommonModels.CategoryResponseDto> } Category found
   * @statusCodes [200, 401, 404]
   */
  export const useFindOne = <TData>(
    { id }: { id: string },
    options?: AppQueryOptions<typeof CategoriesApi.findOne, TData>,
  ) => {
    return useQuery({
      queryKey: keys.findOne(id),
      queryFn: () => CategoriesApi.findOne(id),
      ...options,
    });
  };

  /**
   * Mutation `useUpdate`
   * @summary Update category
   * @description Updates an existing category. Omitted fields are left unchanged; send null to clear optional subDiscipline, gender, age, weight, belt limits, or team size fields.
   * @param { string } mutation.id Path parameter. Category ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @param { CategoriesModels.UpdateCategoryDto } mutation.data Body parameter
   * @param { AppMutationOptions & InvalidateQueryOptions } options Mutation options
   * @returns { UseMutationResult<CommonModels.CategoryResponseDto> } Category updated successfully
   * @statusCodes [200, 400, 401, 404]
   */
  export const useUpdate = (
    options?: AppMutationOptions<
      typeof CategoriesApi.update,
      { id: string; data: CategoriesModels.UpdateCategoryDto }
    > &
      InvalidateQueryOptions,
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ id, data }) => CategoriesApi.update(id, data),
      ...options,
      onSuccess: (...args) => {
        invalidateQueries(queryClient, moduleName, options);
        options?.onSuccess?.(...args);
      },
    });
  };

  /**
   * Mutation `useRemove`
   * @summary Delete category
   * @description Deletes a category by ID
   * @param { string } mutation.id Path parameter. Category ID. Example: `123e4567-e89b-12d3-a456-426614174000`
   * @param { AppMutationOptions & InvalidateQueryOptions } options Mutation options
   * @returns { UseMutationResult<void> } Category deleted successfully
   * @statusCodes [204, 401, 404, 409]
   */
  export const useRemove = (
    options?: AppMutationOptions<typeof CategoriesApi.remove, { id: string }> &
      InvalidateQueryOptions,
  ) => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({ id }) => CategoriesApi.remove(id),
      ...options,
      onSuccess: (...args) => {
        invalidateQueries(queryClient, moduleName, options);
        options?.onSuccess?.(...args);
      },
    });
  };
}
