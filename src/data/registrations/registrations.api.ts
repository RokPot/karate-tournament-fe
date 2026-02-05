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

  export const findOne = (id: string) => {
    return AppRestClient.get(
      { resSchema: RegistrationsModels.RegistrationResponseDtoSchema },
      `/registrations/${id}`,
    );
  };
}
