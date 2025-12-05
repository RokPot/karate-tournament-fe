import { logger } from "@/util/logger";

import { RestInterceptor } from "./rest-interceptor";

export const LoggingInterceptor = new RestInterceptor((client) => {
  return client.interceptors.request.use(
    (config) => {
      logger.info("Rest call", config.method, config.url, config.data);
      return config;
    },
    (error) => {
      logger.error("Rest call error", error);
      return Promise.reject(error);
    },
  );
});
