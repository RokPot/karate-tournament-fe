import { AppRestClient } from "@/util/rest/clients/app-rest-client";
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
}
