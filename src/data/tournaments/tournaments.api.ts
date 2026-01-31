import { z } from "zod";

import { AppRestClient } from "@/util/rest/clients/app-rest-client";

import { TournamentsModels } from "./tournaments.models";

export namespace TournamentsApi {
  export const create = (data: TournamentsModels.CreateTournamentDto) => {
    return AppRestClient.post({ resSchema: TournamentsModels.TournamentResponseDtoSchema }, `/tournaments`, data);
  };

  export const findAll = () => {
    return AppRestClient.get({ resSchema: TournamentsModels.TournamentsFindAllResponseSchema }, `/tournaments`);
  };

  export const findOne = (id: string) => {
    return AppRestClient.get({ resSchema: TournamentsModels.TournamentResponseDtoSchema }, `/tournaments/${id}`);
  };

  export const update = (id: string, data: TournamentsModels.UpdateTournamentDto) => {
    return AppRestClient.put({ resSchema: TournamentsModels.TournamentResponseDtoSchema }, `/tournaments/${id}`, data);
  };

  export const remove = (id: string) => {
    return AppRestClient.delete({ resSchema: z.void() }, `/tournaments/${id}`);
  };

  export const assignCategories = (id: string, data: TournamentsModels.AssignCategoriesDto) => {
    return AppRestClient.put(
      { resSchema: TournamentsModels.TournamentResponseDtoSchema },
      `/tournaments/${id}/categories`,
      data,
    );
  };
}
