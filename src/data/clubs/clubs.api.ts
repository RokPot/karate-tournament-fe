import { z } from "zod";

import { CommonModels } from "@/data/common/common.models";
import { AppRestClient } from "@/util/rest/clients/app-rest-client";

import { ClubsModels } from "./clubs.models";

export namespace ClubsApi {
  export const create = (data: ClubsModels.CreateClubDto) => {
    return AppRestClient.post({ resSchema: CommonModels.ClubResponseDtoSchema }, `/clubs`, data);
  };

  export const findAll = () => {
    return AppRestClient.get({ resSchema: ClubsModels.FindAllResponseSchema }, `/clubs`);
  };

  export const findOne = (id: string) => {
    return AppRestClient.get({ resSchema: CommonModels.ClubResponseDtoSchema }, `/clubs/${id}`);
  };

  export const update = (id: string, data: ClubsModels.UpdateClubDto) => {
    return AppRestClient.put({ resSchema: CommonModels.ClubResponseDtoSchema }, `/clubs/${id}`, data);
  };

  export const remove = (id: string) => {
    return AppRestClient.delete({ resSchema: z.void() }, `/clubs/${id}`);
  };
}
