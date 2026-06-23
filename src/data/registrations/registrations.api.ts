import { AppRestClient } from "@/util/rest/clients/app-rest-client";
import { RegistrationsModels } from "./registrations.models";

export namespace RegistrationsApi {
  export const create = (data: RegistrationsModels.CreateRegistrationDto) => {
    return AppRestClient.post(
      { resSchema: RegistrationsModels.RegistrationResponseDtoSchema },
      `/registrations`,
      data,
    );
  };

  export const createWithUser = (
    data: RegistrationsModels.CreateRegistrationWithUserDto,
  ) => {
    return AppRestClient.post(
      { resSchema: RegistrationsModels.RegistrationResponseDtoSchema },
      `/registrations/public`,
      data,
    );
  };

  export const bulkCreateWithCoach = (
    data: RegistrationsModels.BulkPublicRegistrationDto,
  ) => {
    return AppRestClient.post(
      {
        resSchema: RegistrationsModels.BulkPublicRegistrationResponseDtoSchema,
      },
      `/registrations/public/bulk`,
      data,
    );
  };

  export const getPublicSuitableCategories = (
    tournamentId: string,
    weight: number,
    beltLevel: RegistrationsModels.GetPublicSuitableCategoriesBeltLevelParam,
    dateOfBirth: string,
    gender?: RegistrationsModels.GetPublicSuitableCategoriesGenderParam,
  ) => {
    return AppRestClient.get(
      {
        resSchema:
          RegistrationsModels.GetPublicSuitableCategoriesResponseSchema,
      },
      `/registrations/public/suitable-categories`,
      {
        params: {
          tournamentId,
          weight,
          beltLevel,
          dateOfBirth,
          gender,
        },
      },
    );
  };

  export const getBulkPublicSuitableCategories = (
    data: RegistrationsModels.BulkPublicSuitableCategoriesDto,
  ) => {
    return AppRestClient.post(
      {
        resSchema:
          RegistrationsModels.GetBulkPublicSuitableCategoriesResponseSchema,
      },
      `/registrations/public/suitable-categories/bulk`,
      data,
    );
  };

  export const getSuitableParticipantsByCategory = (
    data: RegistrationsModels.BulkPublicSuitableCategoriesDto,
  ) => {
    return AppRestClient.post(
      {
        resSchema:
          RegistrationsModels.GetSuitableParticipantsByCategoryResponseSchema,
      },
      `/registrations/public/suitable-categories/by-category`,
      data,
    );
  };

  export const findByTournament = (
    tournamentId: string,
    categoryId?: string,
  ) => {
    return AppRestClient.get(
      { resSchema: RegistrationsModels.FindByTournamentResponseSchema },
      `/registrations/by-tournament`,
      {
        params: {
          tournamentId,
          categoryId,
        },
      },
    );
  };

  export const getSuitableCategories = (
    userId: string,
    tournamentId: string,
  ) => {
    return AppRestClient.get(
      { resSchema: RegistrationsModels.GetSuitableCategoriesResponseSchema },
      `/registrations/suitable-categories`,
      {
        params: {
          userId,
          tournamentId,
        },
      },
    );
  };

  export const findOne = (id: string) => {
    return AppRestClient.get(
      { resSchema: RegistrationsModels.RegistrationResponseDtoSchema },
      `/registrations/${id}`,
    );
  };
}
