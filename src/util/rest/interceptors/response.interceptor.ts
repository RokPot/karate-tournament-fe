import { AxiosError } from "axios";

import { logger } from "@/util/logger";

import { RestInterceptor } from "./rest-interceptor";

export const ResponseInterceptor = new RestInterceptor((client) => {
  return client.interceptors.response.use(
    (response) => {
      const payload = response.data;

      if (!payload) {
        return {};
      }

      return payload;
    },
    (error: AxiosError) => {
      logger.error(
        `Rest response error: ${error?.response?.config?.url}`,
        error?.response?.data,
        error?.response?.status,
      );
      throw error;
    },
  );
});
