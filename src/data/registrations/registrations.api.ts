import { AppRestClient } from "@/util/rest/clients/app-rest-client";
import { z } from "zod";
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

  export const lookupRoster = (data: RegistrationsModels.RosterIdentityDto) => {
    return AppRestClient.post(
      { resSchema: RegistrationsModels.RosterLookupResponseDtoSchema },
      `/registrations/public/rosters/lookup`,
      data,
    );
  };

  export const requestRosterOtp = (
    data: RegistrationsModels.RosterOtpRequestDto,
  ) => {
    return AppRestClient.post(
      { resSchema: RegistrationsModels.RosterOtpResponseDtoSchema },
      `/registrations/public/rosters/otp`,
      data,
    );
  };

  export const verifyRosterOtp = (
    data: RegistrationsModels.RosterOtpVerifyDto,
  ) => {
    return AppRestClient.post(
      { resSchema: RegistrationsModels.RosterOtpVerifyResponseDtoSchema },
      `/registrations/public/rosters/otp/verify`,
      data,
    );
  };

  export const getCurrentRoster = (accessToken: string) => {
    return AppRestClient.get(
      { resSchema: RegistrationsModels.RosterResponseDtoSchema },
      `/registrations/public/rosters/current`,
      {
        params: {
          accessToken,
        },
      },
    );
  };

  export const putCurrentRoster = (data: RegistrationsModels.RosterPutDto) => {
    return AppRestClient.put(
      { resSchema: RegistrationsModels.RosterResponseDtoSchema },
      `/registrations/public/rosters/current`,
      data,
    );
  };

  export const getPublicSuitableCategories = (
    tournamentId: string,
    beltLevel: RegistrationsModels.GetPublicSuitableCategoriesBeltLevelParam,
    dateOfBirth: string,
    weight?: number,
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

  export const findCountsByTournament = (tournamentId: string) => {
    return AppRestClient.get(
      { resSchema: RegistrationsModels.FindCountsByTournamentResponseSchema },
      `/registrations/by-tournament/counts`,
      {
        params: {
          tournamentId,
        },
      },
    );
  };

  export const findSubmissionsByTournament = (tournamentId: string) => {
    return AppRestClient.get(
      {
        resSchema:
          RegistrationsModels.FindSubmissionsByTournamentResponseSchema,
      },
      `/registrations/by-tournament/submissions`,
      {
        params: {
          tournamentId,
        },
      },
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

  export const findByUser = (
    userId: string,
    tournamentId?: string,
    status?: RegistrationsModels.FindByUserStatusParam,
  ) => {
    return AppRestClient.get(
      { resSchema: RegistrationsModels.FindByUserResponseSchema },
      `/registrations/by-user`,
      {
        params: {
          userId,
          tournamentId,
          status,
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

  export const findMine = (
    tournamentId?: string,
    status?: RegistrationsModels.FindMineStatusParam,
  ) => {
    return AppRestClient.get(
      { resSchema: RegistrationsModels.FindMineResponseSchema },
      `/registrations/me`,
      {
        params: {
          tournamentId,
          status,
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

  export const update = (
    id: string,
    data: RegistrationsModels.UpdateRegistrationDto,
  ) => {
    return AppRestClient.put(
      { resSchema: RegistrationsModels.RegistrationResponseDtoSchema },
      `/registrations/${id}`,
      data,
    );
  };

  export const remove = (id: string) => {
    return AppRestClient.delete(
      { resSchema: z.void() },
      `/registrations/${id}`,
    );
  };
}
