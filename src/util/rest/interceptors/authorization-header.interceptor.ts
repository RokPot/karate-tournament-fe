import { RestInterceptor } from "./rest-interceptor";

export const AuthorizationHeaderInterceptor = new RestInterceptor(
  (client, getAuthHeader: () => Promise<string | null | undefined>) => {
    return client.interceptors.request.use(async (config) => {
      const authHeader = await getAuthHeader();
      if (authHeader != null) {
        // eslint-disable-next-line no-param-reassign
        config.headers.Authorization = authHeader;
      }

      return config;
    });
  },
);
