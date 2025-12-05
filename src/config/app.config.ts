/* eslint-disable n/no-process-env */

export const AppConfig = {
  isProduction: process.env.NODE_ENV === "production",
  isAppDisabled: false,
  api: {
    url: process.env.NEXT_PUBLIC_API_URL as string,
  },
  i18nextDebug: true,
  log: {
    level: process.env.NEXT_PUBLIC_LOG_LEVEL ?? "error",
  },
  stage: process.env.NEXT_PUBLIC_STAGE as string,
  sentry: {
    enabled: process.env.NODE_ENV === "production",
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN as string,
    environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT as string,
    tracesSampleRate: parseFloat(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? "1.0"),
    replaysSessionSampleRate: parseFloat(process.env.NEXT_PUBLIC_SENTRY_REPLAYS_SESSION_SAMPLE_RATE ?? "0.1"),
    replaysOnErrorSampleRate: parseFloat(process.env.NEXT_PUBLIC_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE ?? "1.0"),
  },

  googleAnalytics: {
    measurementId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID as string | undefined,
  },
  version: process.env.NEXT_PUBLIC_RELEASE,
  authAuth0: {
    domain: process.env.NEXT_PUBLIC_AUTH_AUTH0_DOMAIN!,
    clientId: process.env.NEXT_PUBLIC_AUTH_AUTH0_CLIENT_ID!,
    audience: process.env.NEXT_PUBLIC_AUTH_AUTH0_AUDIENCE!,
    loginRedirectPath: process.env.NEXT_PUBLIC_AUTH_LOGIN_REDIRECT_PATH!,
    logoutRedirectPath: process.env.NEXT_PUBLIC_AUTH_LOGOUT_REDIRECT_PATH!,
    socialRedirectPath: process.env.NEXT_PUBLIC_AUTH_CUSTOM_JWT_REDIRECT_PATH!,
  },
};
