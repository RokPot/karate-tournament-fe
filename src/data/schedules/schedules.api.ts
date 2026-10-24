import { AppRestClient } from "@/util/rest/clients/app-rest-client";
import { z } from "zod";
import { SchedulesModels } from "./schedules.models";

export namespace SchedulesApi {
  export const create = (tournamentId: string, categoryId: string) => {
    return AppRestClient.post(
      { resSchema: SchedulesModels.ScheduleResponseDtoSchema },
      `/tournaments/${tournamentId}/categories/${categoryId}/schedule`,
    );
  };

  export const findOne = (tournamentId: string, categoryId: string) => {
    return AppRestClient.get(
      { resSchema: SchedulesModels.ScheduleResponseDtoSchema },
      `/tournaments/${tournamentId}/categories/${categoryId}/schedule`,
    );
  };

  export const regenerate = (tournamentId: string, categoryId: string) => {
    return AppRestClient.post(
      { resSchema: SchedulesModels.ScheduleResponseDtoSchema },
      `/tournaments/${tournamentId}/categories/${categoryId}/schedule/regenerate`,
    );
  };

  export const downloadTournament = (
    tournamentId: string,
    generateMissing?: boolean,
    scoreCount?: number,
  ) => {
    return AppRestClient.get(
      { resSchema: z.instanceof(Blob) },
      `/tournaments/${tournamentId}/brackets/pdf`,
      {
        params: {
          generateMissing,
          scoreCount,
        },
        headers: {
          Accept: "application/pdf",
        },
        responseType: "blob",
      },
    );
  };

  export const downloadCategory = (
    tournamentId: string,
    categoryId: string,
    generateMissing?: boolean,
    scoreCount?: number,
  ) => {
    return AppRestClient.get(
      { resSchema: z.instanceof(Blob) },
      `/tournaments/${tournamentId}/categories/${categoryId}/bracket/pdf`,
      {
        params: {
          generateMissing,
          scoreCount,
        },
        headers: {
          Accept: "application/pdf",
        },
        responseType: "blob",
      },
    );
  };
}
