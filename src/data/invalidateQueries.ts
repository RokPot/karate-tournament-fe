import { QueryClient, QueryKey } from "@tanstack/react-query";

export const enum QueryModule {
  Healthcheck = "HealthcheckQueries",
  Users = "UsersQueries",
  Clubs = "ClubsQueries",
  Registrations = "RegistrationsQueries",
  Tournaments = "TournamentsQueries",
  Categories = "CategoriesQueries",
  Test = "TestQueries",
}

export interface InvalidateQueryOptions {
  invalidateCurrentModule?: boolean;
  invalidateModules?: QueryModule[];
  invalidateKeys?: QueryKey[];
}

export async function invalidateQueries(
  queryClient: QueryClient,
  currentModule: QueryModule,
  options: InvalidateQueryOptions = {},
) {
  const { invalidateCurrentModule, invalidateModules, invalidateKeys } = options;

  if (invalidateCurrentModule) {
    await queryClient.invalidateQueries({ queryKey: [currentModule] });
  }

  if (invalidateModules) {
    await Promise.all([...invalidateModules.map((module) => queryClient.invalidateQueries({ queryKey: [module] }))]);
  }

  if (invalidateKeys) {
    await Promise.all([...invalidateKeys.map((queryKey) => queryClient.invalidateQueries({ queryKey }))]);
  }
}
