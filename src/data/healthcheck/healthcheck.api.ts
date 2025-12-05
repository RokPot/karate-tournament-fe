import { AppRestClient } from "@/util/rest/clients/app-rest-client";

import { HealthcheckModels } from "./healthcheck.models";

export namespace HealthcheckApi {
  export const getStatus = () => {
    return AppRestClient.get({ resSchema: HealthcheckModels.HttpHealthDtoSchema }, `/`);
  };
}
