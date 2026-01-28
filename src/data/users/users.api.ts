import { CommonModels } from "@/data/common/common.models";
import { AppRestClient } from "@/util/rest/clients/app-rest-client";

import { UsersModels } from "./users.models";

export namespace UsersApi {
  export const getProfile = () => {
    return AppRestClient.get({ resSchema: CommonModels.UserResponseDtoSchema }, `/users/me`);
  };

  export const updateProfile = (data: UsersModels.UpdateUserDto) => {
    return AppRestClient.put({ resSchema: CommonModels.UserResponseDtoSchema }, `/users/me`, data);
  };

  export const findOne = (id: string) => {
    return AppRestClient.get({ resSchema: CommonModels.UserResponseDtoSchema }, `/users/${id}`);
  };
}
