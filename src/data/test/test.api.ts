import { AppRestClient } from "@/util/rest/clients/app-rest-client";
import { TestModels } from "./test.models";

export namespace TestApi {
  export const get = () => {
    return AppRestClient.get(
      { resSchema: TestModels.TestGetResponseDtoSchema },
      `/test`,
    );
  };

  export const post = (data: TestModels.TestRequestDto) => {
    return AppRestClient.post(
      { resSchema: TestModels.TestResponseDtoSchema },
      `/test`,
      data,
    );
  };

  export const echoPath = (message: string) => {
    return AppRestClient.get(
      { resSchema: TestModels.TestEchoResponseDtoSchema },
      `/test/echo/${message}`,
    );
  };
}
