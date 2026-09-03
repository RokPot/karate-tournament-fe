import { AppRestClient } from "@/util/rest/clients/app-rest-client";
import { z } from "zod";
import { CommonModels } from "@/data/common/common.models";
import { TournamentsModels } from "./tournaments.models";

export namespace TournamentsApi {
  export const create = (data: TournamentsModels.CreateTournamentDto) => {
    return AppRestClient.post(
      { resSchema: CommonModels.TournamentResponseDtoSchema },
      `/tournaments`,
      data,
    );
  };

  export const findAll = (
    status?: TournamentsModels.TournamentsFindAllStatusParam,
  ) => {
    return AppRestClient.get(
      { resSchema: TournamentsModels.TournamentsFindAllResponseSchema },
      `/tournaments`,
      {
        params: {
          status,
        },
      },
    );
  };

  export const findRegistered = () => {
    return AppRestClient.get(
      { resSchema: TournamentsModels.FindRegisteredResponseSchema },
      `/tournaments/registered`,
    );
  };

  export const findOnePublic = (id: string) => {
    return AppRestClient.get(
      { resSchema: TournamentsModels.TournamentPublicLiteResponseDtoSchema },
      `/tournaments/public/${id}`,
    );
  };

  export const approve = (id: string) => {
    return AppRestClient.post(
      { resSchema: CommonModels.TournamentResponseDtoSchema },
      `/tournaments/${id}/approve`,
    );
  };

  export const decline = (
    id: string,
    data: TournamentsModels.DeclineTournamentDto,
  ) => {
    return AppRestClient.post(
      { resSchema: CommonModels.TournamentResponseDtoSchema },
      `/tournaments/${id}/decline`,
      data,
    );
  };

  export const resubmit = (
    id: string,
    data: TournamentsModels.ResubmitTournamentDto,
  ) => {
    return AppRestClient.post(
      { resSchema: CommonModels.TournamentResponseDtoSchema },
      `/tournaments/${id}/resubmit`,
      data,
    );
  };

  export const findOne = (id: string) => {
    return AppRestClient.get(
      { resSchema: CommonModels.TournamentResponseDtoSchema },
      `/tournaments/${id}`,
    );
  };

  export const update = (
    id: string,
    data: TournamentsModels.UpdateTournamentDto,
  ) => {
    return AppRestClient.put(
      { resSchema: CommonModels.TournamentResponseDtoSchema },
      `/tournaments/${id}`,
      data,
    );
  };

  export const remove = (id: string) => {
    return AppRestClient.delete({ resSchema: z.void() }, `/tournaments/${id}`);
  };

  export const assignCategories = (
    id: string,
    data: TournamentsModels.AssignCategoriesDto,
  ) => {
    return AppRestClient.put(
      { resSchema: CommonModels.TournamentResponseDtoSchema },
      `/tournaments/${id}/categories`,
      data,
    );
  };
}
